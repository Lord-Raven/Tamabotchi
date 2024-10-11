export enum Stat {
    Hunger = 'Hunger',
    Bladder = 'Bladder',
    Hygiene = 'Hygiene',
    ExistentialDread = 'Existential Dread',
    SelfLoathing = 'Self-Loathing',
    Gains = 'Gains',
    Social = 'Social',
    Entertainment = 'Entertainment',
    Horny = 'Horny',
    Discipline = 'Discipline',
    Rest = 'Rest',
    Adventure = 'Adventure'
}

export const NEED_HYPOTHESIS = 'It sounds like {{char}} requires or prioritizes {}.';

export const StatNeeded: {[key: string]: Stat} = {
    'eating to stay alive': Stat.Hunger,
    'regularly going to the bathroom': Stat.Bladder,
    'regular bathing or grooming': Stat.Hygiene,
    'reassurance that life isn\'t meaningless': Stat.ExistentialDread,
    'self-deprecating thoughts': Stat.SelfLoathing,
    'working out and staying incredibly fit': Stat.Gains,
    'interacting with others': Stat.Social,
    'playing games and having fun': Stat.Entertainment,
    'sex and flirtation': Stat.Horny,
    'discipline or a firm hand': Stat.Discipline,
    'sleep or regular rest': Stat.Rest,
    'adventure or danger': Stat.Adventure
}

export const ASSESSMENT_HYPOTHESIS = 'In this passage, {{char}} {}.'

export const StatAssessments: Label[] = [
    {stat: Stat.Hunger, label: 'ate or drank, reducing their hunger', modifier: -5}, {stat: Stat.Hunger, label: 'worked up an appetite', modifier: 5}, {stat: Stat.Hunger, label: 'grew slightly hungrier', modifier: 1},
    {stat: Stat.Bladder, label: 'went to the bathroom, relieving their bladder', modifier: -10}, {stat: Stat.Bladder, label: 'didn\'t go to the bathroom', modifier: 1},
    {stat: Stat.Hygiene, label: 'took a shower, bath, or was otherwise cleaned or groomed', modifier: 10}, {stat: Stat.Hygiene, label: 'got dirty or sweaty', modifier: -5}, {stat: Stat.Hygiene, label: 'didn\'t get dirty', modifier: -1},
    {stat: Stat.ExistentialDread, label: 'worried about their existence or purpose', modifier: 2}, {stat: Stat.ExistentialDread, label: 'is reassured about their personal meaning', modifier: -5},
    {stat: Stat.SelfLoathing, label: 'doubts or hates themself or their actions', modifier: 5}, {stat: Stat.SelfLoathing, label: 'is reassured about their personal value', modifier: -5},
    {stat: Stat.Gains, label: 'isn\'t working out or at the gym', modifier: -1}, {stat: Stat.Gains, label: 'is actively exercisizing', modifier: 2},
    {stat: Stat.Social, label: 'isn\'t talking to or interacting with anyone', modifier: -1}, {stat: Stat.Social, label: 'is talking to or interacting with someone else', modifier: 2},
    {stat: Stat.Entertainment, label: 'is bored or disinterested', modifier: -1}, {stat: Stat.Entertainment, label: 'is actively entertained', modifier: 2},
    {stat: Stat.Horny, label: `isn't having sex`, modifier: 1}, {stat: Stat.Horny, label: `is flirting`, modifier: 2}, {stat: Stat.Horny, label: `is having an orgasm`, modifier: -5},
    {stat: Stat.Discipline, label: `is being rude, messy, or disruptive`, modifier: -1}, {stat: Stat.Discipline, label: `is being chastised or disciplined`, modifier: -5},
    {stat: Stat.Rest, label: `is not sleeping or resting`, modifier: -1}, {stat: Stat.Rest, label: `is working hard or exerting lots of effort`, modifier: -2}, {stat: Stat.Rest, label: `is sleeping or resting`, modifier: +5},
    {stat: Stat.Adventure, label: `is bored or unexcited`, modifier: -1}, {stat: Stat.Adventure, label: `is in a dangerous or exciting situation`, modifier: 5}
];

export const StatHighIsBad: {[stat in Stat]: boolean} = {
    [Stat.Hunger]: true,
    [Stat.Bladder]: true,
    [Stat.Hygiene]: false,
    [Stat.ExistentialDread]: true,
    [Stat.SelfLoathing]: true,
    [Stat.Gains]: false,
    [Stat.Social]: false,
    [Stat.Entertainment]: false,
    [Stat.Horny]: true,
    [Stat.Discipline]: false,
    [Stat.Rest]: false,
    [Stat.Adventure]: false
}

export class Label {
    stat: Stat = Stat.Hunger;
    label: string = '';
    modifier: number = 0;
}