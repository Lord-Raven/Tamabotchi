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
    Extrovert = 'Extrovert',
    Introvert = 'Introvert',
    Fun = 'Fun',
    Horny = 'Horny',
    Dominance = 'Dominance',
    Submission = 'Submission',
    Adventure = 'Adventure'
};

export const NEED_HYPOTHESIS = 'Judging by these character details, it seems that {{char}} {}.';

export const StatNeeded: {[key: string]: Stat[]} = {
    'is a living creature who must eat, sleep, groom, and go to the bathroom': [Stat.Hunger, Stat.Bladder, Stat.Rest, Stat.Hygiene],
    'is a robot or construct who requires power and maintenance': [Stat.Power, Stat.Maintenance],
    'is an undead who requires flesh, blood, or brains for sustenance': [Stat.Bloodlust],
    'is a demon, warlock, or witch who might steal souls': [Stat.Souls],
    'is filled with self-doubt': [Stat.SelfLoathing],
    'craves praise or ego-stroking': [Stat.Praise],
    'stylizes and keeps up with the latest fashions': [Stat.Style],
    'loves working out and staying fit': [Stat.Gains],
    'is an extrovert who loves socializing': [Stat.Extrovert],
    'is an introvert who avoids socializing': [Stat.Introvert],
    'enjoys gaming or having fun': [Stat.Fun],
    'has a high libido': [Stat.Horny],
    'enjoys dominating others': [Stat.Dominance],
    'dutifully submits to others': [Stat.Submission],
    'craves adventure or thrills': [Stat.Adventure]
};

export const StatOpposites: {[key: string]: Stat[]} = {
    [Stat.Extrovert]: [Stat.Introvert],
    [Stat.Introvert]: [Stat.Extrovert],
    [Stat.SelfLoathing]: [Stat.Praise],
    [Stat.Praise]: [Stat.SelfLoathing],
    // These should be enough to cover the living/robot/undead 
    [Stat.Hunger]: [Stat.Power, Stat.Bloodlust],
    [Stat.Power]: [Stat.Hunger, Stat.Bloodlust],
    [Stat.Bloodlust]: [Stat.Hunger, Stat.Power]
};

export const ASSESSMENT_HYPOTHESIS = 'In this passage, {{char}} {}.'

export const StatAssessments: Label[] = [
    {stat: Stat.Hunger, label: 'ate or drank, reducing their hunger', modifier: -5}, {stat: Stat.Hunger, label: 'worked up an appetite', modifier: 5}, {stat: Stat.Hunger, label: 'grew slightly hungrier', modifier: 1},
    {stat: Stat.Bladder, label: 'went to the bathroom, relieving their bladder', modifier: -10}, {stat: Stat.Bladder, label: 'didn\'t go to the bathroom', modifier: 1},
    {stat: Stat.Hygiene, label: 'took a shower, bath, or was otherwise cleaned or groomed', modifier: 10}, {stat: Stat.Hygiene, label: 'got dirty or sweaty', modifier: -5}, {stat: Stat.Hygiene, label: 'didn\'t get dirty', modifier: -1},
    {stat: Stat.Power, label: 'refueled, recharged, or otherwise regained some energy', modifier: 10}, {stat: Stat.Power, label: 'used some power or energy', modifier: -1},
    {stat: Stat.Maintenance, label: 'got dirty or suffered some wear and tear', modifier: -2}, {stat: Stat.Maintenance, label: 'was repaired, cleaned, or otherwise maintained', modifier: 5},
    {stat: Stat.Bloodlust, label: 'spilled or drank blood or flesh', modifier: -5}, {stat: Stat.Bloodlust, label: 'peacefully existed', modifier: -1},
    {stat: Stat.SelfLoathing, label: 'doubts or hates themself or their actions', modifier: 5}, {stat: Stat.SelfLoathing, label: 'is reassured about their personal value', modifier: -5},
    {stat: Stat.Gains, label: 'isn\'t working out or at the gym', modifier: -1}, {stat: Stat.Gains, label: 'is actively exercisizing', modifier: 2},
    {stat: Stat.Extrovert, label: 'isn\'t talking to or interacting with anyone', modifier: -1}, {stat: Stat.Extrovert, label: 'is talking to or interacting with someone else', modifier: 2},
    {stat: Stat.Introvert, label: `isn't talking to or interacting with anyone`, modifier: 2}, {stat: Stat.Introvert, label: 'is talking to or interacting with someone else', modifier: -1},
    {stat: Stat.Fun, label: 'is bored or disinterested', modifier: -1}, {stat: Stat.Fun, label: 'is actively entertained', modifier: 2},
    {stat: Stat.Horny, label: `isn't having sex`, modifier: 1}, {stat: Stat.Horny, label: `is flirting`, modifier: 2}, {stat: Stat.Horny, label: `is having an orgasm`, modifier: -5},
    {stat: Stat.Rest, label: `is not sleeping or resting`, modifier: -1}, {stat: Stat.Rest, label: `is working hard or exerting lots of effort`, modifier: -2}, {stat: Stat.Rest, label: `is sleeping or resting`, modifier: +5},
    {stat: Stat.Adventure, label: `is bored or unexcited`, modifier: -1}, {stat: Stat.Adventure, label: `is in a dangerous or exciting situation`, modifier: 5}
];

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
    [Stat.Extrovert]: false,
    [Stat.Introvert]: false,
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
};