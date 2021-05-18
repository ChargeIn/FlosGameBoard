import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreditsComponent} from './credits.component';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
    declarations: [
        CreditsComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule
    ]
})
export class CreditsModule {
}
