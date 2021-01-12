# SlackStatusAutomation
**In Progress**

SlackStatusAutomation is change slack user status by automatic.

Automatic changing status conditions:
- Wi-Fi SSID
- IP(public ip, v4 or v6)

## Customize environment
slack apllication require user scope `emoji:read`, `users.profile:write`. And add redirect_url `http://localhost:3333`
```
// for development, paste to src/environments/environment.ts
// for production, paste to src/environments/environment.prod.ts
import { StatusAutomation, Status } from "../app/entities";

export const environment = {
    production: false,
    applications: [
        {
            clientId: "Your client id",
            clientSecret: "Your client secret",
            name: "Test Slack",
            statusAutomations: [
                {
                    conditionGroup: {
                        name: "Test Group",
                        conditions: [
                            { __typename: "IpCondition", ip: "192.168.0.0" },
                            { __typename: "WifiCondition", wifi: "Test Wifi" },
                        ],
                    },
                    status: {
                        emoji: { __typename: "Emoji", key: "house_with_garden", image: null },
                        message: "Remote Working",
                    },
                } as StatusAutomation,
            ],
            defaultStatus: {
                emoji: { __typename: "Emoji", key: "house_with_garden", image: null },
                message: "Default Status",
            } as Status,
        },
    ],
};
```

## License
MIT License