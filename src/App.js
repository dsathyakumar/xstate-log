import "./styles.css";
import { Machine, assign, actions } from "xstate";
import { useMachine } from "@xstate/react";
const { log } = actions;

export default function App() {
  const [state, send] = useMachine(
    Machine(
      {
        id: "light-machine",
        initial: "switch_off",
        context: {
          isOn: false,
          buttonLabel: "Turn ON"
        },
        states: {
          switch_off: {
            entry: log("entering off"),
            on: {
              LIGHT_ON: {
                target: "switch_on",
                actions: ["labelOff"]
              }
            },
            exit: log((ctx, evt) => {
              return `${evt.type}`;
            })
          },
          switch_on: {
            entry: ["update"],
            on: {
              LIGHT_OFF: {
                target: "switch_off",
                actions: ["labelOn"]
              }
            },
            exit: ["update"]
          }
        }
      },
      {
        actions: {
          update: assign((ctx, evt) => {
            return {
              isOn: !ctx.isOn
            };
          }),
          labelOff: assign((ctx, evt) => {
            return {
              buttonLabel: "Turn OFF"
            };
          }),
          labelOn: assign((ctx, evt) => {
            return {
              buttonLabel: "Turn ON"
            };
          })
        }
      }
    ),
    {
      data: {},
      logger: (d) => {
        console.log(d);
        console.log("Im the new logger");
      }
    }
  );

  function triggerChange(e) {
    if (state.matches("switch_off")) {
      send("LIGHT_ON");
    } else {
      send("LIGHT_OFF");
    }
  }

  return (
    <div className="App">
      <div className={state.matches("switch_off") ? "off" : "on"}></div>
      <button onClick={triggerChange}>{state.context.buttonLabel}</button>
    </div>
  );
}
