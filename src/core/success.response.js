'use strict'

const StatusCode = {
  OK: 200,
  CREATED: 201
}

const ReasonStatusCode = {
  OK: 'Success',
  CREATED: 'Created'
}



class SuccessResponse{

  constructor({message, metadata = {}, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK}){
      this.message = !message ? reasonStatusCode : message
      this.status = statusCode
      this.metadata = metadata
  }

  send(res, headers = {}){
    return res.status(this.status).json(this)
  }

}

class OK extends SuccessResponse {
  constructor({message, metadata}){
    super({message, metadata})
  }
}

class CREATED extends SuccessResponse {
  constructor({message, metadata, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED}){
    super({message, metadata, statusCode, reasonStatusCode})
  }
}


export {
  OK, CREATED
}
