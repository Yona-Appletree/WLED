import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WledColorPickerComponent } from "./components/wled-color-picker/wled-color-picker.component";
import { WledPaletteEditorComponent } from "./components/wled-palette-editor/wled-palette-editor.component";
import { WledPalettePickerComponent } from "./components/wled-palette-picker/wled-palette-picker.component";

@NgModule({
  declarations: [
    AppComponent,
    WledColorPickerComponent,
    WledPaletteEditorComponent,
    WledPalettePickerComponent,
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
