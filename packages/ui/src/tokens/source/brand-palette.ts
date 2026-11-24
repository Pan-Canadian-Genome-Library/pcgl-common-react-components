export type BrandTints = readonly [string, string, string, string, string];

export interface BrandColor {
  name: string;
  group: 'primary' | 'secondary';
  base: string;
  tints: BrandTints;
}

export const brandPalette = {
  red: {
    name: 'Red',
    group: 'primary',
    base: '#ec1c24',
    tints: ['#f83c44', '#f4575e', '#f16b71', '#f48287', '#f4a1a4'],
  },
  coolGray: {
    name: 'Cool Gray',
    group: 'primary',
    base: '#929497',
    tints: ['#a6a9ad', '#babec4', '#c7cbd1', '#dde1e6', '#eaedf1'],
  },
  pansyPurple: {
    name: 'Pansy Purple',
    group: 'primary',
    base: '#761248',
    tints: ['#843961', '#9d587d', '#b27696', '#cb9eb6', '#ddc3d1'],
  },
  deepBlue: {
    name: 'Deep Blue',
    group: 'primary',
    base: '#054a74',
    tints: ['#155680', '#1f6592', '#2b7aad', '#4794c6', '#60aadb'],
  },
  lightSeaGreen: {
    name: 'Light Sea Green',
    group: 'secondary',
    base: '#25bea2',
    tints: ['#30cbae', '#41e0c2', '#56eed1', '#87f5e0', '#abf7e8'],
  },
  steelBlue: {
    name: 'Steel Blue',
    group: 'secondary',
    base: '#3d7ea5',
    tints: ['#4c88ac', '#5992b5', '#6ba3c5', '#7bb2d3', '#96cae9'],
  },
  dustyRose: {
    name: 'Dusty Rose',
    group: 'secondary',
    base: '#dfc7c5',
    tints: ['#e3ccca', '#e9d5d3', '#e9dcdb', '#eee3e2', '#f2ebeb'],
  },
  black: {
    name: 'Black',
    group: 'secondary',
    base: '#000000',
    tints: ['#2c2c2c', '#434343', '#656565', '#8e8e8e', '#bababa'],
  },
} as const satisfies Record<string, BrandColor>;

export type BrandColorName = keyof typeof brandPalette;
