import React, { createContext, useReducer } from "react";

const initialState = {
    wallet: { signer: null, provider: null, jsonRpcProvider: null},
    connectedWalletAddress: null,
    connectedNetwork: null,
}

export const StateContext = createContext()
export const DispatchContext = createContext()

const contextReducer = (state, action) => {
    switch (action.type) {
        case 'CONNECT_WALLET':
            return {
                ...state,
                wallet: action.payload,
            }
        case 'DISCONNECT_WALLET':
            return {
                ...state,
                wallet: { signer: null, provider: null, jsonRpcProvider: null },
            }
        case 'SET_CONNECTED_WALLET':
            return {
                ...state,
                connectedWalletAddress: action.payload.address,
                connectedNetwork: action.payload.network
            }
        default:
            throw new Error(`Unknown action type ${action.type}`)
    }
}

const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(contextReducer, initialState)
    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>{children}</StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export default ContextProvider

