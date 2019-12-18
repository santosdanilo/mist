import { MetaInfo, MetaInfoInterface, MetaInfoOutput } from '../metainfo.model';
import { Type, ComponentRef, ViewContainerRef } from '@angular/core';

export interface Projection {
    loadComponents: Function;

    createComponent: Function;

    updateComponentInput?: Function;
    updateComponentOutput?: Function;

    destroyComponents: Function;
}