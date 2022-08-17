import {object, string, TypeOf} from "zod";
export const createUserSchema  = object({
    body:object({
        name:string({
            required_error:'Name is required'
        }),
        password:string({
            required_error:'Name is required'
        }).min(6,"Password too Short - should be 6 chars Minimum"),

        passwordConfirmation:string({
            required_error:'Password Confirmation is Required'
        }),
        email:string({
            required_error:"Email is required"
        }).email('Not a valid email')
    })
    .refine(data=>data.password==data.passwordConfirmation,{
        message:"Those passwords do not manage",
        path:['passwordConfirmation'],
    })
})


export type createUserInput = Omit<TypeOf<typeof createUserSchema>,"body.passwordConfirmation">;
