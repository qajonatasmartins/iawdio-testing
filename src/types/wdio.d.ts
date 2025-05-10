import '@wdio/globals';

declare module '@wdio/globals' {
    interface RequestedStandaloneCapabilities {
        noReset?: boolean;
        automationName?: string;
    }
} 