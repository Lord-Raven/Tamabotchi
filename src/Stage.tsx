import React, {ReactElement} from "react";
import {StageBase, StageResponse, InitialData, Message, Character, User} from "@chub-ai/stages-ts";
import {LoadResponse} from "@chub-ai/stages-ts/dist/types/load";
import {Client} from "@gradio/client";
import {Display} from "./Display";

import {
    ASSESSMENT_HYPOTHESIS, FEMININE_LABEL, MASCULINE_LABEL,
    NEED_HYPOTHESIS, SpriteMap,
    Stat,
    StatAssessments,
    StatHighIsBad,
    StatHypotheses,
    StatOpposites,
    StatPerTurn, StatPrompts
} from "./Stat";

type MessageStateType = any;

type ConfigType = any;

type InitStateType = any;

type ChatStateType = any;


export class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {

    client: any;
    characters: {[key: string]: Character};
    user: User;
    badStats: Stat[];

    // MessageState variables:
    stats: {[key: string]: number} = {};
    health: number = 3;
    masculine: boolean = false;
    characterType: number = 0;


    constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
        super(data);
        const {
            characters, 
            users, 
            messageState, 
        } = data;

        this.characters = characters;
        this.user = users[Object.values(users)[0].anonymizedId];
        this.badStats = [];

        this.readMessageState(messageState);
        
    }

    async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {

        this.client = await Client.connect("Ravenok/statosphere-backend");

        this.setBadStats();

        console.log('Finished loading stage.');

        return {
            success: true,
            error: null,
            initState: null,
            chatState: null,
        };
    }

    async setState(state: MessageStateType): Promise<void> {
        this.readMessageState(state);
    }

    readMessageState(messageState: any) {
        console.log('readMessageState');
        console.log(messageState);
        this.stats = messageState?.stats ?? {};
        this.health = messageState?.health ?? 3;
        this.masculine = messageState?.masculine ?? false;
        this.characterType = messageState?.characterType ?? 0;

        this.setBadStats();
    }

    buildMessageState(): any {
        console.log('buildMessageState');
        console.log({stats: this.stats, health: this.health, masculine: this.masculine, characterType: this.characterType});
        return {
            stats: this.stats,
            health: this.health,
            masculine: this.masculine,
            characterType: this.characterType
        };
    }

    setBadStats() {
        this.badStats = [];
        for (let stat of Object.keys(this.stats)) {
            if ((StatHighIsBad[stat as Stat] ? (20 - this.stats[stat]) : this.stats[stat]) < 3) {
                this.badStats.push(stat as Stat);
            }
        }
    }

    async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
        const {
            content,
            promptForId
        } = userMessage;

        // Look at content to make changes to stats:
        if (promptForId) {
            const character = this.characters[promptForId];
            // First, check that some stats exist; if not, analyze which stats are relevant to this character.
            if (!this.stats || Object.keys(this.stats).length == 0 || this.characterType == 0) {
                await this.chooseRequiredStats(character);
            }
            await this.assessStatChanges(content, character);
            this.setBadStats();
        }

        let stageDirection = '';
        // Build stage directions
        for (let stat in this.stats) {
            for (let prompt of StatPrompts[stat as Stat]) {
                if ((StatHighIsBad ? (20 - this.stats[stat])  : this.stats[stat]) <= prompt.threshold) {
                    stageDirection = `${stageDirection}\n${prompt.prompt}`;
                    break;
                }
            }
        }

        console.log(stageDirection);

        return {
            stageDirections: stageDirection,
            messageState: this.buildMessageState(),
            modifiedMessage: null,
            systemMessage: null,
            error: null,
            chatState: null,
        };
    }

    async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
        const {
            content,
            anonymizedId
        } = botMessage;

        const character = this.characters[anonymizedId];
        // First, check that some stats exist; if not, analyze which stats are relevant to this character.
        if (!this.stats || Object.keys(this.stats).length == 0) {
            await this.chooseRequiredStats(character);
        }

        for (let stat in this.stats) {
            this.stats[stat] = Math.max(0, Math.min(20, this.stats[stat] + StatPerTurn[stat as Stat]));
        }

        // Look at content to make changes to stats
        await this.assessStatChanges(content, character);
        this.setBadStats();

        return {
            stageDirections: null,
            messageState: this.buildMessageState(),
            modifiedMessage: null,
            error: null,
            systemMessage: null,
            chatState: null
        };
    }

    async chooseRequiredStats(character: Character) {
        console.log('Determining appropriate stats for this bot.');

        const response = (await this.generator.textGen({
            prompt: `{{system_prompt}}\n\nAbout {{char}}: ${character.personality}\n${character.description}\n` +
                `Hypothesis statements: ` +
                `${Object.keys(StatHypotheses).map((stat, index) => `${index + 1}. {{char}} ${stat}`).join('\n')}` +
                `Priority Instruction: Above is a list of formal hypothesis statements about the character, {{char}}, representing various things that could be true or false about this character. ` +
                `Based on the provided details of {{char}} and your perception of their likely physiology and personality, ` +
                `choose and list verbatim any true hypotheses from the above statements in order of relevance to this specific character. ` +
                `Omit hypotheses which are definitively false or which conflict with more relevant items.`,
            min_tokens: 30,
            max_tokens: 150,
            include_history: true,
            template: '{{messages}}'
        }))?.result ?? '';

        console.log(response);

        this.stats = {};
        let genderFound = false;
        let typeFound = false;
        this.characterType = 1;

        let foundHypotheses = Object.keys(StatHypotheses).map(hypothesis => ({
                key: hypothesis,
                position: response.indexOf(hypothesis)
            }))
            .filter(item => item.position >= 0)
            .sort((a, b) => a.position - b.position)
            .map(item => item.key);


        for (let hypothesis of foundHypotheses) {

            // Female is default; swap to male if masculine occurs first.
            if (hypothesis == FEMININE_LABEL) {
                genderFound = true;
            } else if (hypothesis == MASCULINE_LABEL && !genderFound) {
                this.masculine = true;
                genderFound = true;
            } else if (SpriteMap[hypothesis] && !typeFound) {
                this.characterType = SpriteMap[hypothesis];
                typeFound = true;
            }

            let bannedStats: Stat[] = [];

            StatHypotheses[hypothesis].forEach(stat => {
                console.log('Found stat in StatNeeded:' + stat);
                if (!bannedStats.includes(stat) && !this.stats[stat]) {
                    console.log(`Adding stat: ${stat}.`);
                    this.stats[stat] = StatHighIsBad[stat] ? 0 : 10;
                    if (Object.keys(StatOpposites).includes(stat)) {
                        bannedStats.push(...StatOpposites[stat]);
                    }
                }
            });
        }


/*
        this.stats = {};

        const data = {
            sequence: this.replaceTags(`{{char}} Details:\n${this.char.description}\n${this.char.personality}\n${this.char.tavern_personality}`, {'char': this.char.name, 'user': this.user.name}),
            candidate_labels: Object.keys(StatNeeded), 
            hypothesis_template: this.replaceTags(NEED_HYPOTHESIS, {'char': this.char.name, 'user': this.user.name}), 
            multi_label: true 
        };

        const result = await this.query(data);

        const MAX_STATS = 8;
        const STAT_THRESHOLD = 0.01;

        this.characterType = 1;

        let index = 0;
        let bannedStats: Stat[] = [];
        while (index < result.scores.length && Object.keys(this.stats).length < MAX_STATS) {
            console.log(`Considering ${result.labels[index]}: ${result.scores[index]}`);
            if (result.scores[index] > STAT_THRESHOLD) {
                console.log('Met threshold');
                if (result.scores[index] > 0.5 && result.labels[index] == MASCULINE_LABEL) {
                    this.masculine = true;
                } else if (SpriteMap[result.labels[index]]) {
                    this.characterType = SpriteMap[result.labels[index]];
                }
                StatNeeded[result.labels[index]].forEach(stat => {
                    console.log('Found stat in StatNeeded:' + stat);
                    if (!bannedStats.includes(stat) && !this.stats[stat]) {
                        console.log(`Adding stat: ${stat}.`);
                        this.stats[stat] = StatHighIsBad[stat] ? 0 : 10;
                        if (Object.keys(StatOpposites).includes(stat)) {
                            bannedStats.push(...StatOpposites[stat]);
                        }
                    }
                });
            }
            index++;
        }*/
        console.log('Finished building stats:');
        console.log(this.stats);
    }

    async assessStatChanges(content: string, character: Character) {
        console.log('Determining stat changes for provided content');

        const candidate_labels = Object.values(StatAssessments).filter(label => {console.log(label.stat); return this.stats[label.stat]}).map(label => label.label);

        const data = {
            sequence: this.replaceTags(content, {'char': character.name, 'user': this.user.name}),
            candidate_labels: candidate_labels,
            hypothesis_template: this.replaceTags(ASSESSMENT_HYPOTHESIS, {'char': character.name, 'user': this.user.name}),
            multi_label: true
        };

        console.log(data);
        console.log(this.stats);

        const result = await this.query(data);

        const MAX_STATS = 4;
        const STAT_THRESHOLD = 0.3;

        let index = 0;
        while (result.scores && index < result.scores.length && this.stats.length < MAX_STATS) {

            if (result.scores[index] > STAT_THRESHOLD) {
                const label = Object.values(StatAssessments).filter(label => label.label = result.labels[index])[0];
                if (this.stats[label.stat]) {
                    this.stats[label.stat] = Math.max(0, Math.min(20, this.stats[label.stat] + label.modifier));
                }
            }
            index++;
        }
    }

    replaceTags(source: string, replacements: {[name: string]: string}) {
        return source.replace(/{{([A-z]*)}}/g, (match) => {
            return replacements[match.substring(2, match.length - 2)];
        });
    }

    async query(data: any) {
        let result: any = {};
        if (this.client) {
            try {
                const response = await this.client.predict("/predict", {data_string: JSON.stringify(data)});
                console.log(response);
                result = JSON.parse(`${response.data[0]}`);
            } catch(e) {
                console.log(e);
            }
            console.log({sequence: data.sequence, hypothesisTemplate: data.hypothesis_template, labels: result.labels, scores: result.scores});
        }

        return result;
    }

    render(): ReactElement {
        return <div style={{position: 'relative', width: '100vw', height: '100vw' }}>
                <img style={{position: 'absolute', top: '0%', left: '0%', width: '100%', height: '100%', zIndex: '1'}} src={'/tamabotchi.png'} alt="Tamagotchi-style hand-held electronic game"/>
                <Display messageState = {this.buildMessageState()}/>
            </div>;
    }

}
