export enum Stat {
    Hunger = 'Hunger',
    Bladder = 'Bladder',
    Rest = 'Rest',
    Hygiene = 'Hygiene',
    Power = 'Power',
    Maintenance = 'Maintenance',
    Bloodlust = 'Bloodlust',
    Souls = 'Souls',
    SelfLoathing = 'Self-Loathing',
    Praise = 'Praise',
    Style = 'Style',
    Gains = 'Gains',
    Social = 'Social',
    SocialBattery = 'Social Battery',
    Fun = 'Fun',
    Horny = 'Horny',
    Dominance = 'Dominance',
    Submission = 'Submission',
    Adventure = 'Adventure'
}

export const NEED_HYPOTHESIS = 'Judging by these character details, it seems that {{char}} {}.';

export const StatNeeded: {[key: string]: Stat[]} = {
    'is a living creature who must eat, sleep, groom, and go to the bathroom': [Stat.Hunger, Stat.Bladder, Stat.Rest, Stat.Hygiene],
    'is a robot or construct who requires power and maintenance': [Stat.Power, Stat.Maintenance],
    'is an undead who requires flesh, blood, or brains for sustenance': [Stat.Bloodlust],
    'is a demon, necromancer, warlock, or witch who might steal souls': [Stat.Souls],
    'is filled with self-doubt': [Stat.SelfLoathing],
    'craves praise or ego-stroking': [Stat.Praise],
    'stylizes and keeps up with the latest fashions': [Stat.Style],
    'loves working out and staying fit': [Stat.Gains],
    'is an extrovert who loves socializing': [Stat.Social],
    'is an introvert who avoids socializing': [Stat.SocialBattery],
    'enjoys gaming or having fun': [Stat.Fun],
    'has a high libido': [Stat.Horny],
    'enjoys dominating others': [Stat.Dominance],
    'dutifully submits to others': [Stat.Submission],
    'craves adventure or thrills': [Stat.Adventure]
};

export const StatOpposites: {[key: string]: Stat[]} = {
    [Stat.Social]: [Stat.SocialBattery],
    [Stat.SocialBattery]: [Stat.Social],
    [Stat.SelfLoathing]: [Stat.Praise],
    [Stat.Praise]: [Stat.SelfLoathing],
    // These should be enough to cover the living/robot/undead 
    [Stat.Hunger]: [Stat.Power, Stat.Bloodlust],
    [Stat.Power]: [Stat.Hunger, Stat.Bloodlust],
    [Stat.Bloodlust]: [Stat.Hunger, Stat.Power]
};

export const ASSESSMENT_HYPOTHESIS = 'In this passage, {{char}} {}.'

export const StatAssessments: Label[] = [
    {stat: Stat.Hunger, label: 'ate or drank, reducing their hunger', modifier: -15}, {stat: Stat.Hunger, label: 'worked up an appetite', modifier: 5},
    {stat: Stat.Bladder, label: 'went to the bathroom, relieving their bladder', modifier: -20},
    {stat: Stat.Hygiene, label: 'took a shower, bath, or was otherwise cleaned or groomed', modifier: 15}, {stat: Stat.Hygiene, label: 'got dirty or sweaty', modifier: -5},
    {stat: Stat.Rest, label: `is working hard or exerting lots of effort`, modifier: -2}, {stat: Stat.Rest, label: `is sleeping or resting`, modifier: 10},
    {stat: Stat.Power, label: 'refueled, recharged, or otherwise regained some energy', modifier: 15},
    {stat: Stat.Maintenance, label: 'got dirty or suffered some wear and tear', modifier: -3}, {stat: Stat.Maintenance, label: 'was repaired, cleaned, or otherwise maintained', modifier: 10},
    {stat: Stat.Bloodlust, label: 'spilled or drank blood or flesh', modifier: -5},
    {stat: Stat.Souls, label: 'secured, absorbed, or preyed upon a soul or essence', modifier: -15},
    {stat: Stat.SelfLoathing, label: 'doubts or hates themself or their actions', modifier: 5}, {stat: Stat.SelfLoathing, label: 'is reassured about their personal value', modifier: -5},
    {stat: Stat.Praise, label: 'is praised, worshipped, complimented, or valued', modifier: 5},
    {stat: Stat.Style, label: 'changes up their appearance or refreshes their style', modifier: 20},
    {stat: Stat.Gains, label: 'is actively exercising', modifier: 5},
    {stat: Stat.Social, label: 'is talking to or interacting with someone else', modifier: 5},
    {stat: Stat.SocialBattery, label: `isn't talking to or interacting with anyone`, modifier: 5},
    {stat: Stat.Fun, label: 'is actively entertained', modifier: 5},
    {stat: Stat.Horny, label: `is flirting`, modifier: 2}, {stat: Stat.Horny, label: `is having an orgasm`, modifier: -15},
    {stat: Stat.Dominance, label: 'is dominating someone else', modifier: 5},
    {stat: Stat.Submission, label: 'is being dominated by someone else', modifier: 5},
    {stat: Stat.Adventure, label: `is in a dangerous or thrilling situation`, modifier: 10}
];

export const StatPrompts: {[stat in Stat]: Prompt[]} = {
    [Stat.Hunger]: [{threshold: 2, prompt: '{{char}} is starving.'}, {threshold: 6, prompt: '{{char}} is getting hungry.'}],
    [Stat.Bladder]: [{threshold: 0, prompt: '{{char}} is about to wet themselves.'}, {threshold: 6, prompt: '{{char}} needs to go to the bathroom.'}],
    [Stat.Hygiene]: [{threshold: 1, prompt: '{{char}} is absolutely filthy.'}, {threshold: 6, prompt: '{{char}} could use a shower.'}],
    [Stat.Rest]: [{threshold: 1, prompt: '{{char}} is about to nod off.'}, {threshold: 6, prompt: '{{char}} is a bit tired.'}],
    [Stat.Power]: [{threshold: 1, prompt: '{{char}} is out of energy and will shut down.'}, {threshold: 6, prompt: '{{char}} is running low on power; they should look to refuel or recharge.'}],
    [Stat.Maintenance]: [{threshold: 1, prompt: '{{char}} is in such disrepair they may stop functioning altogether.'}, {threshold: 6, prompt: '{{char}} could use some maintenance.'}],
    [Stat.Bloodlust]: [{threshold: 1, prompt: `{{char}} may just die if they don't spill blood soon.`}, {threshold: 6, prompt: '{{char}} craves blood.'}],
    [Stat.Souls]: [{threshold: 1, prompt: '{{char}} can barely function until they acquire more souls or essence.'}, {threshold: 6, prompt: '{{char}} needs a soul or some essence to feel right again'}],
    [Stat.SelfLoathing]: [{threshold: 1, prompt: '{{char}} hates themself so much, it may not be safe to leave them alone.'}, {threshold: 6, prompt: '{{char}} is wracked with self-doubt or self-loathing.'}],
    [Stat.Praise]: [{threshold: 1, prompt: `{{char}} is inordinately upset that they haven't been receiving enough praise or affirmation; they may act erratically until they receive it.`}, {threshold: 6, prompt: '{{char}} feels they deserve some praise, worship, or affirmation; they may act out until they receive it.'}],
    [Stat.Style]: [{threshold: 1, prompt: `{{char}} is overtly embarrassed that they haven't changed up their outfit or look in a while.`}, {threshold: 6, prompt: '{{char}} thinks their current outfit or look is getting a little stale and will look for an opportunity to spruce up or alter their appearance.'}],
    [Stat.Gains]: [{threshold: 1, prompt: `{{char}} believes they must work out immediately or risk losing their gains.`}, {threshold: 6, prompt: `{{char}} hasn't worked out in a while and thinks they could use a bit of exercise.`}],
    [Stat.Social]: [{threshold: 1, prompt: `{{char}} feels like they are dying of loneliness and is likely to embarrass themself.`}, {threshold: 6, prompt: '{{char}} needs to socialize a bit and feel a sense of friendship or belonging.'}],
    [Stat.SocialBattery]: [{threshold: 1, prompt: '{{char}} is absolutely sick of dealing with people right now and is likely to act rudely or embarrass themself.'}, {threshold: 6, prompt: '{{char}} has had plenty of social interaction to last a while and could use a break from people.'}],
    [Stat.Fun]: [{threshold: 1, prompt: '{{char}} is dying of boredom and can barely function.'}, {threshold: 6, prompt: '{{char}} is getting bored.'}],
    [Stat.Horny]: [{threshold: 1, prompt: '{{char}} is uncontrollably horny and desperate for relief.'}, {threshold: 6, prompt: '{{char}} is getting horny.'}],
    [Stat.Dominance]: [{threshold: 1, prompt: '{{char}} urgently needs to assert their dominance in grand fashion.'}, {threshold: 6, prompt: '{{char}} is itching to assert their dominance.'}],
    [Stat.Submission]: [{threshold: 1, prompt: '{{char}} will beg to submit to a dominant partner.'}, {threshold: 6, prompt: '{{char}} desires to be put in their place by a dominant partner.'}],
    [Stat.Adventure]: [{threshold: 1, prompt: '{{char}} craves immediate adventure and will now try to drum up trouble.'}, {threshold: 6, prompt: '{{char}} is in need of adventure and may be on the lookout for trouble.'}]
};

export const StatPerTurn: {[stat in Stat]: number} = {
    [Stat.Hunger]: 1,
    [Stat.Bladder]: 1,
    [Stat.Hygiene]: -1,
    [Stat.Rest]: -1,
    [Stat.Power]: -1,
    [Stat.Maintenance]: -1,
    [Stat.Bloodlust]: 1,
    [Stat.Souls]: -1,
    [Stat.SelfLoathing]: 1,
    [Stat.Praise]: -1,
    [Stat.Style]: -1,
    [Stat.Gains]: -1,
    [Stat.Social]: -1,
    [Stat.SocialBattery]: 0,
    [Stat.Fun]: -1,
    [Stat.Horny]: 1,
    [Stat.Dominance]: -1,
    [Stat.Submission]: -1,
    [Stat.Adventure]: -1
};

export const StatHighIsBad: {[stat in Stat]: boolean} = {
    [Stat.Hunger]: true,
    [Stat.Bladder]: true,
    [Stat.Rest]: false,
    [Stat.Hygiene]: false,
    [Stat.Power]: false,
    [Stat.Maintenance]: false,
    [Stat.Bloodlust]: true,
    [Stat.Souls]: false,
    [Stat.SelfLoathing]: true,
    [Stat.Praise]: false,
    [Stat.Style]: false,
    [Stat.Gains]: false,
    [Stat.Social]: false,
    [Stat.SocialBattery]: false,
    [Stat.Fun]: false,
    [Stat.Horny]: true,
    [Stat.Dominance]: false,
    [Stat.Submission]: false,
    [Stat.Adventure]: false
};

export class Label {
    stat: Stat = Stat.Hunger;
    label: string = '';
    modifier: number = 0;
}

export class Prompt {
    prompt: string = '';
    threshold: number = 0;
}