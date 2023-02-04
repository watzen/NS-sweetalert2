/**
 * @NAPIVersion 2.1
 */
import * as currentRecord  from 'N/currentRecord'
import * as record from 'N/record'
import * as search from 'N/search'
import Swal from 'sweetalert2'

const maxCharacters = 999

export const updateMemo = () => {

    const curRec = currentRecord.get()
    const { type, id } = curRec

    const currentMemo = search.lookupFields({
        type: type as string,
        id,
        columns: ['memomain'],
    }).memomain

    Swal.fire({
        title: 'Update memo',
        showCancelButton: true,
        html: `
            <textarea placeholder="Please enter the new memo..." style="width: 75%" id="memoInput" class="swal2-textarea" required >${currentMemo}</textarea></br>
            <span id="typed-characters">${maxCharacters} characters remaining</span>
        `,
        focusConfirm: false,
        confirmButtonColor: '#607799',
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        didOpen: didOpenFunction,
        preConfirm: () => {
            if((document.getElementById('memoInput') as HTMLInputElement).value.length > maxCharacters) {
                Swal.showValidationMessage('Please enter a memo.')
                return false
            }

            const memo = (document.getElementById('memoInput') as HTMLInputElement).value
            return record.submitFields.promise({ type, id, values: { memo } }).then(recordId => {
                if (!recordId) {
                    throw new Error('Failed to update the memo!')
                }
                window.location.reload()
                Swal.fire({ title: 'Memo is updated!', icon: 'success', showConfirmButton: false, timer: 1000, timerProgressBar: true })
            }).catch((error) => {
                console.log(error)
                Swal.showValidationMessage(
                    'Update failed!',
                )
            })
        },
    })
}

const didOpenFunction = () => {
    const textAreaElement = document.getElementById('memoInput') as HTMLTextAreaElement
    const typedCharactersElement = document.getElementById('typed-characters') as HTMLSpanElement

    const updateRemainingChars = () => {
        const typedCharacters = textAreaElement.value.length

        typedCharactersElement.textContent = maxCharacters - typedCharacters + ' character(s) remaining'
        if (typedCharacters > maxCharacters) {
            typedCharactersElement.textContent = typedCharacters - maxCharacters + ' too many character(s)!'
            typedCharactersElement.style.color = 'red'
            Swal.showValidationMessage('Please enter a shorter memo.')
        } else {
            typedCharactersElement.style.color = 'inherit'
            Swal.resetValidationMessage()
        }
    }

    textAreaElement.addEventListener('input', updateRemainingChars)
}
