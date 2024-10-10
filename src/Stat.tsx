export enum Stat {
    Hunger = 'Hunger',
    Bladder = 'Bladder',
    Hygiene = 'Hygiene',
    ExistentialDread = 'Existential Dread',
    SelfLoathing = 'Self-Loathing',
    Gains = 'Gains',
    Social = 'Social',
    Entertainment = 'Entertainment',
}

export const NEED_HYPOTHESIS = 'It sounds like {{char}} requires or prioritizes {}.';

export const StatNeeded: {[stat in Stat]: string} = {
    [Stat.Hunger]: 'eating to stay alive',
    [Stat.Bladder]: 'regularly going to the bathroom',
    [Stat.Hygiene]: 'regular bathing or grooming',
    [Stat.ExistentialDread]: 'reassurance that life isn\'t meaningless',
    [Stat.SelfLoathing]: 'self-deprecating thoughts',
    [Stat.Gains]: 'working out and staying incredibly fit',
    [Stat.Social]: 'interacting with others',
    [Stat.Entertainment]: 'playing games and having fun',
}

export const ASSESSMENT_HYPOTHESIS = 'In this passage, {{char}} {}.'

export const StatAssessments: {[stat in Stat]: Label[]} = {
    [Stat.Hunger]: [{label: 'ate or drank, reducing their hunger', modifier: -10}, {label: 'worked up an appetite', modifier: 5}, {label: 'grew slightly hungrier', modifier: 1}],
    [Stat.Bladder]: [{label: 'went to the bathroom, relieving their bladder', modifier: -10}, {label: 'didn\'t go to the bathroom', modifier: 1}],
    [Stat.Hygiene]: [{label: 'took a shower, bath, or was otherwise cleaned or groomed', modifier: 10}, {label: 'got dirty or sweaty', modifier: -5}, {label: 'didn\'t get dirty', modifier: -1}],
    [Stat.ExistentialDread]: [{label: 'worried about their existence or purpose', modifier: 2}, {label: 'is reassured about their personal meaning', modifier: -5}],
    [Stat.SelfLoathing]: [{label: 'doubts or hates themself or their actions', modifier: 5}, {label: 'is reassured about their personal value', modifier: -5}],
    [Stat.Gains]: [{label: 'isn\'t working out or at the gym', modifier: -1}, {label: 'is actively exercisizing', modifier: 2}],
    [Stat.Social]: [{label: 'isn\'t talking to or interacting with anyone', modifier: -1}, {label: 'is talking to or interacting with someone else', modifier: 2}],
    [Stat.Entertainment]: [{label: 'is bored or disinterested', modifier: -1}, {label: 'is actively entertained', modifier: 2}]
}

export const StatHighIsBad: {[stat in Stat]: boolean} = {
    [Stat.Hunger]: true,
    [Stat.Bladder]: true,
    [Stat.Hygiene]: false,
    [Stat.ExistentialDread]: true,
    [Stat.SelfLoathing]: true,
    [Stat.Gains]: false,
    [Stat.Social]: false,
    [Stat.Entertainment]: false
}

export class Label {
    label: string = '';
    modifier: number = 0;
}