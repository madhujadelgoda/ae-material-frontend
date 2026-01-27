import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { StorageService } from '../services/storage.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set hasPermission(permission: string) {
    this.viewContainer.clear();

    if (StorageService.hasPermission(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
