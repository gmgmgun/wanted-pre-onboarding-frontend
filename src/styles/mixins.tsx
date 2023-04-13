import {css, FlattenSimpleInterpolation} from "styled-components";

export const pageWrapperMixin: FlattenSimpleInterpolation = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const titleMixin: FlattenSimpleInterpolation = css`
  margin: 100px 0 50px 0;
  font-size: 40px;
`;
