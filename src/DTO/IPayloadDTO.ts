export default interface IPayloadDTO {
  user: { id: string; roles: ReadonlyArray<string> };
}
