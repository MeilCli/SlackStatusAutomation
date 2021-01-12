import { IpCondition, WifiCondition } from "./condition";

export interface ConditionGroup {
    name: string;
    conditions: (IpCondition | WifiCondition)[];
}
