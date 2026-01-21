import { ChangeDetectionStrategy, Component, inject, model, output, TemplateRef } from '@angular/core';
import { TablerIconComponent, provideTablerIcons } from '@luoxiao123/angular-tabler-icons';
import { IconX, IconClock, IconCalendarDue, IconInfoCircle } from '@luoxiao123/angular-tabler-icons/icons';
import { NgTemplateOutlet } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'date-time-picker-container',
  templateUrl: './container.component.html',
  styles: `
    :host {
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TablerIconComponent, NgTemplateOutlet],
  providers: [provideTablerIcons({ IconInfoCircle, IconCalendarDue, IconX, IconClock })]
})
export class Container {
  readonly #breakpoints = inject(BreakpointObserver);

  public isMobile = this.#breakpoints.isMatched([Breakpoints.Handset, Breakpoints.Tablet]);

  hasHeader = model<boolean | undefined>(true);
  hasFooter = model<boolean | undefined>(true);
  headerTitle = model<string>('');

  headerExtraContent = model<TemplateRef<any> | undefined>();

  footerExtraContent = model<TemplateRef<any> | undefined>();
  hasDismiss = model<boolean | undefined>(true);
  hasSubmit = model<boolean | undefined>(true);
  submitTitle = model<string>('Save');
  submitBg = model<string>('bg-green-700');
  submitColor = model<string>('text-white');
  submitTitleColor = model<string>('text-white');
  disabledSubmit = model<boolean | undefined>(false);

  hasSecondaryButton = model<boolean | undefined>(false);
  secondaryButtonTitle = model<string>('');
  secondaryButtonBg = model<string>('');
  secondaryButtonColor = model<string>('text-white');
  secondaryButtonTitleColor = model<string>('text-white');
  disabledSecondaryButton = model<boolean | undefined>(false);

  dismiss = output<void>();
  submit = output<void>();
  secondaryButton = output<void>();
}
