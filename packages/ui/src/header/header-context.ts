import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type ComponentType,
  type Ref,
} from 'react';

export type HeaderTranslator = (key: string) => string;

export type HeaderLinkComponentProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
};

export type HeaderLinkComponent = ComponentType<HeaderLinkComponentProps> | 'a';

interface HeaderContextValue {
  translator: HeaderTranslator;
  linkComponent: HeaderLinkComponent;
  closePanel: () => void;
}

export const HeaderContext = createContext<HeaderContextValue>({
  translator: (key) => key,
  linkComponent: 'a',
  closePanel: () => {},
});

export const useHeaderContext = () => useContext(HeaderContext);
