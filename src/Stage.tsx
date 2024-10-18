import React, {ReactElement, useEffect, useState} from "react";
import {StageBase, StageResponse, InitialData, Message, Character, User} from "@chub-ai/stages-ts";
import {LoadResponse} from "@chub-ai/stages-ts/dist/types/load";
import {env, pipeline} from '@xenova/transformers';
import {Client} from "@gradio/client";
import {Display} from "./Display";

import {
    ASSESSMENT_HYPOTHESIS, MASCULINE_LABEL,
    NEED_HYPOTHESIS, SpriteMap,
    Stat,
    StatAssessments,
    StatHighIsBad,
    StatNeeded,
    StatOpposites,
    StatPerTurn, StatPrompts
} from "./Stat";

type MessageStateType = any;

type ConfigType = any;

type InitStateType = any;

type ChatStateType = any;


export class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {

    client: any;
    fallbackPipelinePromise: Promise<any> | null = null;
    fallbackPipeline: any = null;
    fallbackMode: boolean;
    char: Character;
    user: User;

    // MessageState variables:
    stats: {[key: string]: number} = {};
    health: number = 3;
    masculine: boolean = false;
    characterType: number = 0;


    constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
        super(data);
        const {
            characters,         // @type:  { [key: string]: Character }
            users,                  // @type:  { [key: string]: User}
            messageState,                           //  @type:  MessageStateType
        } = data;

        this.char = characters[Object.values(characters)[0].anonymizedId];
        this.user = users[Object.values(users)[0].anonymizedId];
        
        this.fallbackMode = false;
        this.fallbackPipeline = null;
        env.allowRemoteModels = false;

        this.readMessageState(messageState);
        
    }

    async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {

        try {
            this.fallbackPipelinePromise = this.getPipeline();
        } catch (exception: any) {
            console.error(`Error loading pipeline: ${exception}`);
        }

        try {
            this.client = await Client.connect("Ravenok/statosphere-backend", {hf_token: import.meta.env.VITE_HF_API_KEY});
        } catch (error) {
            console.error(`Error connecting to backend pipeline; will resort to local inference.`);
            this.fallbackMode = true;
        }

        console.log('Finished loading stage.');

        return {
            success: true,
            error: null,
            initState: null,
            chatState: null,
        };
    }

    async getPipeline() {
        return pipeline("zero-shot-classification", "Xenova/mobilebert-uncased-mnli");
    }

    async setState(state: MessageStateType): Promise<void> {
        this.readMessageState(state);
    }

    readMessageState(messageState: any) {
        if (messageState) {
            this.stats = messageState.stats ?? {};
            this.health = messageState.health ?? 3;
            this.masculine = messageState.masculine ?? false;
            this.characterType = messageState.characterType ?? 0;
        }
    }

    buildMessageState(): any {
        return {
            stats: this.stats,
            health: this.health,
            masculine: this.masculine,
            characterType: this.characterType
        };
    }

    async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
        const {
            content,
        } = userMessage;

        // First, check that some stats exist; if not, analyze which stats are relevant to this character.
        if (!this.stats || Object.keys(this.stats).length == 0) {
            await this.chooseRequiredStats();
        }

        // Look at content to make changes to stats:
        await this.assessStatChanges(content);

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
        } = botMessage;

        // First, check that some stats exist; if not, analyze which stats are relevant to this character.
        if (!this.stats || Object.keys(this.stats).length == 0) {
            await this.chooseRequiredStats();
        }

        for (let stat in this.stats) {
            this.stats[stat] = Math.max(0, Math.min(20, this.stats[stat] + StatPerTurn[stat as Stat]));
        }

        // Look at content to make changes to stats
        await this.assessStatChanges(content);

        return {
            stageDirections: null,
            messageState: this.buildMessageState(),
            modifiedMessage: null,
            error: null,
            systemMessage: null,
            chatState: null
        };
    }

    async chooseRequiredStats() {
        console.log('Determining appropriate stats for this bot.');

        this.stats = {};

        const data = {
            sequence: this.replaceTags(`[CHARACTER DETAILS]\n${this.char.description}\n${this.char.personality}\n${this.char.tavern_personality}\n[/CHARACTER DETAILS]`, {'char': this.char.name, 'user': this.user.name}), 
            candidate_labels: Object.keys(StatNeeded), 
            hypothesis_template: this.replaceTags(NEED_HYPOTHESIS, {'char': this.char.name, 'user': this.user.name}), 
            multi_label: true 
        };

        const result = await this.query(data);

        const MAX_STATS = 6;
        const STAT_THRESHOLD = 0.01;

        this.characterType = 1;

        let index = 0;
        let bannedStats: Stat[] = [];
        while (index < result.scores.length && Object.keys(this.stats).length < MAX_STATS) {
            console.log(`Considering: ${result.scores[index]}`);
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
        }
        console.log('Finished building stats:');
        console.log(this.stats);
    }

    async assessStatChanges(content: string) {
        console.log('Determining stat changes for provided content');

        const data = {
            sequence: this.replaceTags(content, {'char': this.char.name, 'user': this.user.name}), 
            candidate_labels: Object.values(StatAssessments).filter(label => this.stats[label.stat]).map(label => label.label),
            hypothesis_template: this.replaceTags(ASSESSMENT_HYPOTHESIS, {'char': this.char.name, 'user': this.user.name}),
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
        let result: any = null;
        if (this.client && !this.fallbackMode) {
            try {
                const response = await this.client.predict("/predict", {data_string: JSON.stringify(data)});
                result = JSON.parse(`${response.data[0]}`);
            } catch(e) {
                console.log(e);
            }
        }
        if (!result) {
            if (!this.fallbackMode) {
                console.log('Falling back to local zero-shot pipeline.');
                this.fallbackMode = true;
            }
            if (this.fallbackPipeline == null) {
                this.fallbackPipeline = this.fallbackPipelinePromise ? await this.fallbackPipelinePromise : await this.getPipeline();
            }
            result = await this.fallbackPipeline(data.sequence, data.candidate_labels, { hypothesis_template: data.hypothesis_template, multi_label: data.multi_label });
        }
        console.log({sequence: data.sequence, hypothesisTemplate: data.hypothesis_template, labels: result.labels, scores: result.scores});
        return result;
    }

    render(): ReactElement {
        return <div style={{position: 'relative', width: '100vw', height: '100vw' }}>
                <img style={{position: 'absolute', top: '0%', left: '0%', width: '100%', height: '100%', zIndex: '1'}} src={'/tamabotchi.png'} alt="Tamagotchi-style hand-held electronic game"/>
                <Display messageState = {this.buildMessageState()}/>
            </div>;
    }

}
