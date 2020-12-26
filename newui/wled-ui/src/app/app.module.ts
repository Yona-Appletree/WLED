import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WledColorPickerComponent } from "./components/wled-color-picker/wled-color-picker.component";
import { WledEffectSelectorComponent } from "./components/wled-effect-selector/wled-effect-selector.component";
import { WledPaletteEditorComponent } from "./components/wled-palette-editor/wled-palette-editor.component";
import { WledPalettePickerComponent } from "./components/wled-palette-picker/wled-palette-picker.component";
import { WledPopupComponent } from "./components/wled-popup/wled-popup.component";
import { WledTabBarComponent, WledTabBarTabComponent } from "./components/wled-tab-bar/wled-tab-bar.component";

@NgModule({
  declarations: [
    AppComponent,
    WledColorPickerComponent,
    WledPaletteEditorComponent,
    WledPalettePickerComponent,
    WledTabBarComponent,
    WledTabBarTabComponent,
    WledEffectSelectorComponent,
    WledPopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
