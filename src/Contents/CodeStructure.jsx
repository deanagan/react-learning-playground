import styled from "styled-components";
import { dedentStrUsing1stLineIndent } from "../Utils/util";
import { Better, Problematic } from "../Demo/MoveStateDown";
import { useEffect, useLayoutEffect, useState } from "react";

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
  // {
  //   uniqueId: 2,
  //   text: "Lift Content Up",
  //   codes: [
  //     {
  //       uniqueId: 1,
  //       lineNumbers: "",
  //       src: dedentStrUsing1stLineIndent(`
  //             function ExpensiveComponent() {
  //               const renderCount = useRef(0);
  //               useEffect(() => {
  //                 const t = setTimeout(() => console.log("expensive tree!"), 2000);
  //                 renderCount.current += 1;
  //                 return () => clearTimeout(t);
  //               });
  //               const totalRender = renderCount.current;
  //               return <p>I am a very slow component, rendered {totalRender} times!.</p>;
  //             }

  //             export default function Problematic() {
  //               const [color, setColor] = useState("red");
  //               return (
  //                 <div style={{ color }}>
  //                   <input value={color} onChange={(e) => setColor(e.target.value)} />
  //                   <p>Hello, world!</p>
  //                   <ExpensiveComponent />
  //                 </div>
  //               );
  //             }`),
  //     },
  //     {
  //       uniqueId: 2,
  //       lineNumbers: "13,15,16",
  //       src: dedentStrUsing1stLineIndent(`
  //             function ExpensiveComponent() {
  //               const renderCount = useRef(0);
  //               useEffect(() => {
  //                 const t = setTimeout(() => console.log("expensive tree!"), 2000);
  //                 renderCount.current += 1;
  //                 return () => clearTimeout(t);
  //               });
  //               const totalRender = renderCount.current;
  //               return <p>I am a very slow component, rendered {totalRender} times!.</p>;
  //             }

  //             export default function Problematic() {
  //               const [color, setColor] = useState("red");
  //               return (
  //                 <div style={{ color }}>
  //                   <input value={color} onChange={(e) => setColor(e.target.value)} />
  //                   <p>Hello, world!</p>
  //                   <ExpensiveComponent />
  //                 </div>
  //               );
  //             }`),
  //     },
  //     {
  //       uniqueId: 3,
  //       lineNumbers: "",
  //       src: dedentStrUsing1stLineIndent(`
  //             function LiftContentUp({ children }) {
  //               const [color, setColor] = useState("red");
  //               return (
  //                 <div style={{ color }}>
  //                   <input value={color} onChange={(e) => setColor(e.target.value)} />
  //                   {children}
  //                 </div>
  //               );
  //             }

  //             export default function Better() {
  //               return (
  //                 <LiftContentUp>
  //                   <p>Hello, world!</p>
  //                   <ExpensiveComponent />
  //                 </LiftContentUp>
  //               );
  //             }
  //             `),
  //     },
  //   ],
  //   codeSandBoxLink:
  //     "https://codesandbox.io/s/lift-up-content-qgyyn?file=/src/Better.jsx:664-813",
  // },
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

const DemoFlexItem = styled.div`
  width: 20%;
  border: 20px;
`;

export default function CodeStructure({slideNumber, fragmentNumber}) {
  const [isBetterComponent, setIsBetterComponent] = useState(false)
  const codeData = (codes) => {
    const data = codes.map((code) => {
      return (<code
        key={code.uniqueId}
        className={code.uniqueId === 1 ? "javascript" : "fragment javascript"}
        data-trim
        data-line-numbers={code.lineNumbers}
      >
        {code.src}
      </code>)
    });

    return data
  }

  useEffect(() => {
    if (slideNumber.h === 3) {
      console.log('setting to better')
      setIsBetterComponent(fragmentNumber === 1)
    }
  }, [slideNumber, fragmentNumber]);

  useLayoutEffect(() => {
    console.log(fragmentNumber)
  })

  return (
    <section>
      <h4>Code structure - our plan A to improve performance</h4>

      {structures.map(({uniqueId, text, codes}) => {
        const data = codeData(codes);
        return (<section key={uniqueId}>
          <FlexContainer>
            <CodeFlexItem>
              <StyledParagraph>{text}</StyledParagraph>
              <StyledPre className="prettyprint">{data}</StyledPre>
            </CodeFlexItem>
            <div>

             { isBetterComponent ? <Better /> : <Problematic /> }
            </div>
          </FlexContainer>
        </section>)
      })}
    </section>
  );
}