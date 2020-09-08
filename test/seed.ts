import { sign } from 'jsonwebtoken';



export const contents = [{
        content: 'text 0',
        created_at: new Date(2019, 1, 20),
        updated_at: new Date(2019, 1, 21),
        public_id: 'text0',
        mime_type: 'text/plain'
},
{
    content: 'const unique = array.reduce((result, element) => {return result.includes(element) ? result : [...result, element];}, []);',
    created_at: new Date(2019, 2, 20),
    updated_at: new Date(2019, 2, 21),
    public_id: 'js123',
    mime_type: 'application/javascript'
},
{
    content: '<note>\
    <to>Tove</to>\
    <from>Jani</from>\
    <heading>Reminder</heading>\
    <body>Don\'t forget me this weekend!</body>\
    </note>',
    created_at: new Date(2019, 3, 20),
    updated_at: new Date(2019, 3, 21),
    public_id: 'xml12',
    mime_type: 'application/xml'
}
]

export const users = [
    {
        email: 'tal.shnitzer@gmail.com',
        created_at: new Date(2019, 1, 1)
    },
    {
        email: 'dor.rabbi@gmail.com',
        created_at: new Date(2019, 2, 10)
    },
    {
        email: 'roy.abulafia@gmail.com',
        created_at: new Date(2019, 3, 20)
    }
]

//TODO - use all iser fiekds in payload to sign
let expiresIn = '7d';
export const token = [ 
    sign({payload: users[0].email}, process.env.JWT_SECRET, {expiresIn}), 
    sign({payload: users[1].email}, process.env.JWT_SECRET, {expiresIn}),
    sign({payload: users[2].email}, process.env.JWT_SECRET, {expiresIn})
];

