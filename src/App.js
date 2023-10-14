import {useState, useReducer} from 'react';
import './App.css';
import DigitButtons from './components/DigitButtons';
import OperationButton from './components/OperationButton';

export const ACTIONS = {

  ADD_DIGIT:'add_digit',
  CHOOSE_OPERATION:'choose-oepration',
  DELETE_DIGIT:'delete_digit',
  EVALUATE:'evaluate'
}


function reducer(state,{type,payload})
{
  switch(type)
  {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite)
      {
        return{
          ...state,
          currentOperand:payload.digit,
          overwrite:false
        }
      }
      if(payload.digit === "0" && state.currentOperand==="0")
      {
        return state
      }
        
      if(payload.digit === "." && state.currentOperand.includes(".") )
      {
        return state;
      }
      return {
        ...state,
        currentOperand:`${state.currentOperand || ""}${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION:

      if(state.currentOperand==null && state.previousOperand==null)
      {
        return state
      }
      if(state.previousOperand==null)
      {
        return{
          ...state,
          operation:payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null

        }
      }

      if(state.currentOperand == null)
      {
        return{
          ...state,
          operation:payload.operation
        }
      }

      return{
        ...state,
        previousOperand:evaluate(state),
        operation:payload.operation,
        currentOperand:null
      }

    case ACTIONS.EVALUATE:
      if(state.operation == null || state.currentOperand== null || state.previousOperand==null)
      {
        return state;
      }

      return{
        ...state,
        overwrite:true,
        previousOperand:null,
        operation:null,
        currentOperand: evaluate(state)
      }
    case ACTIONS.DELETE_DIGIT:

      if (state.overwrite) 
      {
        return {

          ...state,
          overwrite: false,
          currentOperand: null
        }
      }

      if (state.currentOperand == null) return state

      if (state.currentOperand.length == 1) 
      {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

      
  }

}

function evaluate({currentOperand,previousOperand,operation})
{
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if( isNaN(prev) || isNaN(current)) return"";

  let computation="";
  switch(operation){
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break

    case "×":
      computation = prev *current;
      break

    case "÷":
      computation = prev / current;
      break
  }

  return computation.toString();
}
function App(){


  const[{ currentOperand, previousOperand, operation},dispatch] = useReducer(reducer,{})


  return (
   
    <div className="calculator-grid">

      <div className="output">
        <div className="previous-operand">{previousOperand}{operation}</div>
        <div className="current-operand">{currentOperand}</div>

      </div>

      <DigitButtons digit="7" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="8" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="9" dispatch={dispatch}></DigitButtons>
      <button className='operation' onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>⌫</button>

      <DigitButtons digit="4" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="5" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="6" dispatch={dispatch}></DigitButtons>
      <OperationButton className="operation" operation="÷" dispatch={dispatch}></OperationButton>

      <DigitButtons digit="1" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="2" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="3" dispatch={dispatch}></DigitButtons>

      <div className="btns">
        <OperationButton className="operation" operation="×" dispatch={dispatch}></OperationButton>
        <OperationButton className="operation" operation="-" dispatch={dispatch}></OperationButton>

      </div>
      <DigitButtons digit="0" className="l" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="." dispatch={dispatch}></DigitButtons>
      <button onClick={() => dispatch({ type: ACTIONS.EVALUATE })} className='operation'>=</button>
      <OperationButton operation="+" dispatch={dispatch}></OperationButton>

    </div>
    
  );
}

export default App;
