import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

export const ClickAnimation = trigger('clickAnimation', [
  transition('* => *', [
    style({ scale: 1 }),
    animate('0.08s', style({ scale: 0.9 })),
    animate('0.08s', style({ scale: 1 })),
  ]),
]);
