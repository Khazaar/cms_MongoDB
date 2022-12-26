import { Category } from "./emums";
import { ITaskStatic } from "./models/task.model";

export const sampleTaskStatic: ITaskStatic[] = [
    {
        name: "Task 1",
        category: [Category.Angular],
        durationLimit: 10,
        points: 10,
        bonusTask: "Bonus 1",
        extraTime: 1,
        extraPoints: 1,
        description: "First task",
    },
    {
        name: "Task 2",
        category: [Category.React],
        durationLimit: 20,
        points: 20,
        bonusTask: "Bonus 2",
        extraTime: 2,
        extraPoints: 2,
        description: "Second task",
    },
];
