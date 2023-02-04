/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
import { EntryPoints } from 'N/types'
import { updateMemo } from "../client/wtz_cs_update_memo_button_function";

export const beforeLoad = (context: EntryPoints.UserEvent.beforeLoadContext) => {

    const { form } = context

    if(![
        context.UserEventType.VIEW,
    ].includes(context.type)) {
        return
    }

    form.clientScriptModulePath = 'SuiteScripts/models/journalentry/client/wtz_cs_update_memo_button_function.js'

    form.addButton({
        id: 'custpage_wtz_update_memo',
        label: '✏️ Update memo',
        functionName: 'updateMemo',
    })

}
