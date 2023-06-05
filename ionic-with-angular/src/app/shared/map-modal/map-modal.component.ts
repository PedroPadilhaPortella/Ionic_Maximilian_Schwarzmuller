import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { window } from 'rxjs';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapElementRef!: ElementRef;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() { }

  select() {
    this.modalController.dismiss({ lat: 0, lng: 0 })
  }

  cancel() {
    this.modalController.dismiss();
  }
}
