import { Icon, IconProps } from '@chakra-ui/react';

export const GovIcon = ({
  width = '20px',
  height = '20px',
  color = 'white',
  ...props
}: IconProps) => {
  return (
    <Icon width={width} height={height} viewBox="0 0 20 20" fill="none" color={color} {...props}>
      <path
        d="M7.98686 7.74656C8.05942 7.74656 8.12039 7.77496 8.16992 7.83161L8.73387 8.52156L9.47582 7.61657L9.09493 7.15162C8.80802 6.82838 8.46667 6.66663 8.071 6.66663H6.50296C6.48978 6.66663 6.479 6.6708 6.47088 6.67914C6.46262 6.68748 6.4585 6.69664 6.4585 6.70659V7.70659C6.4585 7.71655 6.46262 7.72584 6.47088 7.73405C6.479 7.74239 6.48978 7.74656 6.50296 7.74656H7.98686Z"
        fill="currentColor"
      />
      <path
        d="M11.9392 6.66663C11.5402 6.66663 11.1972 6.82663 10.9103 7.14664L9.24324 9.18648L8.16992 10.4964C8.11706 10.5532 8.05609 10.5814 7.98686 10.5814H6.50296C6.48978 10.5814 6.4798 10.5856 6.47327 10.594C6.46662 10.6023 6.46342 10.6115 6.46342 10.6214V11.6214C6.46342 11.6349 6.46662 11.6456 6.47327 11.654C6.4798 11.6623 6.48978 11.6665 6.50296 11.6665H8.06608C8.46508 11.6665 8.80802 11.5049 9.09493 11.1815L10.0052 10.0716L10.9153 11.1815C11.1988 11.5049 11.5402 11.6665 11.9392 11.6665H13.5023C13.5155 11.6665 13.5253 11.6623 13.532 11.654C13.5385 11.6458 13.5418 11.6365 13.5418 11.6265V10.6265C13.5418 10.6133 13.5385 10.6024 13.532 10.5941C13.5253 10.5857 13.5155 10.5816 13.5023 10.5816H12.0184C11.949 10.5816 11.8898 10.5549 11.8403 10.5015L10.7422 9.16158L11.8353 7.83161C11.8849 7.77496 11.9458 7.74656 12.0184 7.74656H13.5023C13.5155 7.74656 13.5253 7.74239 13.532 7.73405C13.5385 7.72584 13.5418 7.71655 13.5418 7.70659V6.70659C13.5418 6.69327 13.5385 6.68331 13.532 6.67658C13.5253 6.66999 13.5155 6.66663 13.5023 6.66663H11.9392Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2196 2.33142C10.0781 2.27836 9.9222 2.27836 9.78071 2.33142L8.36977 2.86052C7.20176 3.29853 5.94489 3.44652 4.70709 3.29179L3.41102 3.12979C3.23313 3.10755 3.05426 3.16277 2.91987 3.28141C2.78548 3.40005 2.7085 3.57069 2.7085 3.74996V8.59968C2.7085 11.9928 4.6256 15.0948 7.66054 16.6123L9.72065 17.6423C9.89661 17.7303 10.1037 17.7303 10.2797 17.6423L12.3398 16.6123C15.3747 15.0948 17.2918 11.9928 17.2918 8.59968V3.74996C17.2918 3.57069 17.2149 3.40005 17.0805 3.28141C16.9461 3.16277 16.7672 3.10755 16.5893 3.12979L15.2932 3.29179C14.0554 3.44652 12.7986 3.29853 11.6306 2.86052L10.2196 2.33142ZM8.80867 4.03094L10.0002 3.58413L11.1917 4.03094C12.5491 4.53997 14.0097 4.71196 15.4483 4.53214L16.0418 4.45795V8.59968C16.0418 11.5194 14.3922 14.1885 11.7808 15.4942L10.0002 16.3845L8.21956 15.4942C5.6081 14.1885 3.9585 11.5194 3.9585 8.59968V4.45795L4.55205 4.53214C5.99058 4.71196 7.45125 4.53997 8.80867 4.03094Z"
        fill="currentColor"
      />
    </Icon>
  );
};