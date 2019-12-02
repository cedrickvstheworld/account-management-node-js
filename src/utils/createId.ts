import uuidv4 from 'uuid'

// creates _id and id for a new document
export const createId = (document: any) => {
  const uuid = uuidv4()
  return {...document, ...{_id: uuid}}
}
