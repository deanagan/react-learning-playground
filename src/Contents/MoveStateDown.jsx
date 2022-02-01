import { useEffect, useState } from "react";
import styled from "styled-components";

import { Better, Problematic } from "../Demo/MoveStateDownDemo";
import { dedentStrUsing1stLineIndent } from "../Utils/util";

const structures = [
  {
    uniqueId: 1,
    text: "Move State Down",
    codes: [
      {
        uniqueId: 1,
        lineNumbers: "",
        isProblematic: true,
        note: "ExpensiveComponent re-renders each time the color is changed when it shouldn't need to.",
        src: dedentStrUsing1stLineIndent(`
              function ExpensiveComponent() {
                const renderCount = useRef(0);
                useEffect(() => {
                  const t = setTimeout(() => console.log("expensive tree!"), 2000);
                  renderCount.current += 1;
                  return () => clearTimeout(t);
                });
                const totalRender = renderCount.current;
                return <p>I am a very slow component, rendered {totalRender} times!.</p>;
              }

              export default function Problematic() {
                const [color, setColor] = useState("red");
                return (
                  <div>
                      <input value={color} onChange={(e) => setColor(e.target.value)} />
                      <p style={{ color }}>Hello, world!</p>
                      <ExpensiveComponent />
                  </div>
                );
              }`),
      },
      {
        uniqueId: 2,
        lineNumbers: "13,16,17",
        isProblematic: true,
        note: "These items can be moved down",
        src: dedentStrUsing1stLineIndent(`
              function ExpensiveComponent() {
                const renderCount = useRef(0);
                useEffect(() => {
                  const t = setTimeout(() => console.log("expensive tree!"), 2000);
                  renderCount.current += 1;
                  return () => clearTimeout(t);
                });
                const totalRender = renderCount.current;
                return <p>I am a very slow component, rendered {totalRender} times!.</p>;
              }

              export default function Problematic() {
                const [color, setColor] = useState("red");
                return (
                  <div>
                      <input value={color} onChange={(e) => setColor(e.target.value)} />
                      <p style={{ color }}>Hello, world!</p>
                      <ExpensiveComponent />
                  </div>
                );
              }`),
      },
      {
        uniqueId: 3,
        lineNumbers: "",
        isProblematic: false,
        note: "Shifting to the function component MovedStateDown, fixes the problem.",
        src: dedentStrUsing1stLineIndent(`
              function MovedStateDown() {
                const [color, setColor] = useState("red");
                return (
                    <>
                      <input value={color} onChange={(e) => setColor(e.target.value)} />
                      <p style={{ color }}>Hello, world!</p>
                    </>
                );
              }

              export default function Better() {
                return (
                  <div>
                    <MovedStateDown />
                    <ExpensiveComponent />
                  </div>
                );
              }`),
      },
    ],
    codeSandBoxLink:
      "https://codesandbox.io/s/move-state-down-pogbq?file=/src/Better.js",
  },
];

const StyledParagraph = styled.p`
  font-size: 0.5em;
`;
const StyledPre = styled.pre`
  code {
    font-size: 0.65em;
    line-height: 1.3;
  }
`;

const FlexContainer = styled.div`
  display: flex;
`;

const CodeFlexItem = styled.div`
  width: 70%;
`;

export default function MoveStateDown({ slideNumber, fragmentNumber }) {
  const [isBetterComponent, setIsBetterComponent] = useState(false);
  const codeData = (codes) => {
    const data = codes.map((code) => {
      return (
        <code
          key={code.uniqueId}
          className={code.uniqueId === 1 ? "javascript" : "fragment javascript"}
          data-trim
          data-line-numbers={code.lineNumbers}
        >
          {code.src}
        </code>
      );
    });

    return data;
  };

  useEffect(() => {
    if (slideNumber.h === 3) {
      setIsBetterComponent(fragmentNumber === 1);
    }
  }, [slideNumber, fragmentNumber]);

  return (
    <section>
      <h4>Code structure - our plan A to improve performance</h4>

      {structures.map(({ uniqueId, text, codes }) => {
        const data = codeData(codes);
        return (
          <section key={uniqueId}>
            <FlexContainer>
              <CodeFlexItem>
                <StyledParagraph>{text}</StyledParagraph>
                <StyledPre className="prettyprint">{data}</StyledPre>
              </CodeFlexItem>
              <div>{isBetterComponent ? <Better /> : <Problematic />}</div>
            </FlexContainer>
          </section>
        );
      })}
    </section>
  );
}
