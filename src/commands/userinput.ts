/* user input helpers */

import { window, InputBoxOptions } from "vscode";

export async function askForName(prompt: string, initialValue: string): Promise<string> {
    const inputBoxOptions: InputBoxOptions = {
        value: initialValue,
        prompt: prompt,
        validateInput: (value: string) => {
            var regex = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$');
            if (!value || !regex.test(value))
                return 'Please enter a valid name. Allowed characters are: a-z, A-Z, 0-9, _';
            return '';
        }
    }
    return await window.showInputBox(inputBoxOptions);
}

export async function askForVerb(prompt: string, initialValue: string): Promise<string> {
    const inputBoxOptions: InputBoxOptions = {
        value: initialValue,
        prompt: prompt,
        validateInput: (value: string) => {
            var regex = new RegExp('^[a-z][a-zA-Z]*$');
            if (!value || !regex.test(value))
                return 'Please enter a valid verb. Allowed characters are: a-z, A-Z';
            return '';
        }
    }
    return await window.showInputBox(inputBoxOptions);
}

export async function askForStringSelection(prompt: string, values: string[]): Promise<string> {
    return await window.showQuickPick(values, { placeHolder: prompt });
}

export async function askForMultipleStringSelection(prompt: string, values: string[]): Promise<string[]> {
    return await window.showQuickPick(values, { canPickMany: true, placeHolder: prompt });
}
