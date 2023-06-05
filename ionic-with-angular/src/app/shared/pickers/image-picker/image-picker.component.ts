import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

  @Output('imagePick') imagePick = new EventEmitter<string | File>();
  @ViewChild('filePicker') filePickerRef!: ElementRef<HTMLInputElement>;

  selectedImage: string | undefined = '';
  usePicker = false;

  constructor(
    private alertController: AlertController,
    private platform: Platform,
  ) { }

  ngOnInit() {
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
  }

  onPickImage() {
    if (Capacitor.isPluginAvailable('Camera')) {
      Camera.getPhoto({
        quality: 50,
        source: CameraSource.Prompt,
        correctOrientation: true,
        width: 420,
        resultType: CameraResultType.DataUrl
      }).then((image) => {
        this.selectedImage = image.dataUrl;
        this.imagePick.emit(image.dataUrl);
      }).catch((error) => {
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
        }
      })
    } else {
      this.filePickerRef.nativeElement.click();
    }
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files?.item(0);
    if (pickedFile) {
      const fr = new FileReader();
      fr.onload = () => {
        this.selectedImage = fr.result?.toString();
        this.imagePick.emit(pickedFile)
      }
      fr.readAsDataURL(pickedFile);
    }

  }

  private showErrorAlert() {
    this.alertController.create({
      header: 'Could not acess the camera',
      buttons: ['Ok'],
    })
  }
}
