import { createTaskDynamic } from "./src/engines/taskDynamic.engines";

createTaskDynamic({
    taskStaticName: "Task 1",
    startTime: 122,
    endTime: 142,
    participantsList: ["Participant 5", "Participant 6"],
});
