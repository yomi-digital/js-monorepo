import { Icon, IconProps } from '@chakra-ui/icons';

export const KwentaIcon = ({
  width = '30px',
  height = '30px',
  ...props
}: IconProps) => (
  <Icon width={width} height={height}  fill="none" {...props}>
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.5" cy="8.5" r="8" fill="url(#paint0_linear_26_5654)" stroke="#0B0B22" />
      <g clip-path="url(#clip0_26_5654)">
        <path
          d="M8.69336 3.1875L14.1863 6.5983V10.0091L8.69336 6.5983V3.1875Z"
          fill="url(#paint1_linear_26_5654)"
        />
        <path
          d="M8.69336 13.7989L14.1863 10.4225V7.04617L8.69336 10.4225V13.7989Z"
          fill="url(#paint2_linear_26_5654)"
        />
        <path
          d="M8.69327 3.1875L3.33594 6.5983V10.0091L8.69327 6.5983V3.1875Z"
          fill="url(#paint3_linear_26_5654)"
        />
        <path
          d="M8.69327 13.7989L3.33594 10.4225V7.04617L8.69327 10.4225V13.7989Z"
          fill="url(#paint4_linear_26_5654)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_26_5654"
          x1="3.4"
          y1="1.98333"
          x2="14.1667"
          y2="17"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#835E34" />
          <stop offset="1" stop-color="#344548" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_26_5654"
          x1="18.8703"
          y1="6.57928"
          x2="5.32498"
          y2="6.57928"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#996939" />
          <stop offset="1" stop-color="#D0A875" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_26_5654"
          x1="11.4398"
          y1="13.7989"
          x2="12.8345"
          y2="0.889045"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#272728" />
          <stop offset="1" stop-color="#4B4B4B" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_26_5654"
          x1="8.72635"
          y1="4.58593"
          x2="3.24266"
          y2="8.78682"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#996939" />
          <stop offset="1" stop-color="#D0A875" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_26_5654"
          x1="6.0146"
          y1="13.7989"
          x2="6.0146"
          y2="7.04617"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#363636" />
          <stop offset="1" stop-color="#333232" />
        </linearGradient>
        <clipPath id="clip0_26_5654">
          <rect
            width="12.2188"
            height="10.625"
            fill="white"
            transform="translate(2.65625 3.1875)"
          />
        </clipPath>
      </defs>
    </svg>
  </Icon>
);
