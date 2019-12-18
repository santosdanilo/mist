import { Type } from '@angular/core';

export interface MetaInfo {
    component: Type<any>;
    template?: string;
    inputs?: MetaInfoInterface;
    outputs?: MetaInfoOutput;
}

export interface MetaInfoInterface {
    force?: boolean;
    value: {
        [key: string]: any
    }
}

export interface MetaInfoOutput {
    force?: boolean;
    value: {
        [key: string]: {
            success?: Function,
            fail?: Function,
            complete?: Function
        }
    }
}