
export interface LogoStyle {
  name: string;
  description: string;
}

export interface LogoStyleCategory {
  category: string;
  icon: string;
  styles: LogoStyle[];
}
