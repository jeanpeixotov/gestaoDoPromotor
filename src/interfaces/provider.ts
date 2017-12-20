export interface IProvider {
  id: number;
  title: string;
  date: Date;
  message: string;
  creatorId?: number;
  churchId?: number;
  typeId: number;

  icon?: string;
}
