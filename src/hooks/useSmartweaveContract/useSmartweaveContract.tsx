

import { useState } from "react";

function useSmartweaveContract (contractId:string) {

    const [state, setState] = useState<{[x:string]: any} | null>(null)
    const [interactions, setInteractions] = useState<{[x:string]: any} | null>(null)
    const [evaluationOptions, setEvaluationOptions] = useState<{[x:string]: any} | null>(null) // warp eval options
    const [loading, setLoading] = useState<boolean>(true)
    const [loadingPercentage, setLoadingPercentage] = useState<number>(0)
    const [errors, setErrors] = useState<string | null>(null)



    return {state, interactions, loading, errors}

}

export default useSmartweaveContract