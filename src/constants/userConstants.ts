export type UserRow = {
  id: number;
  avatar: React.ReactNode;
  username: string;
  last_login: string | null;
};

export const userColumns = [
  { key: 'avatar', header: 'Аватар' },
  { key: 'id', header: 'ID' },
  { key: 'username', header: 'Username' },
  { key: 'last_login', header: 'Останній вхід' },
];