import React from "react";

import { highlightMatches } from "../helpers";

const baseClass = "command-palette";
interface IHighlightedLabelProps {
  text: string;
  query: string;
}

/**
 * Wraps matched ranges of `query` within `text` in <mark> elements so the
 * Wraps matched ranges of `query` within `text` in <mark> elements so the
 * Fragment — callers control the surrounding element/class.
 */
}: IHighlightedLabelProps): JSX.Element => {
  return (
    <>
      {highlightMatches(text, query).map((seg, i) =>
        seg.matched ? (
