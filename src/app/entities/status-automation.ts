import { ConditionGroup } from "./condition-group";
import { Status } from "./status";

export interface StatusAutomation {
    conditionGroup: ConditionGroup;
    status: Status;
}
