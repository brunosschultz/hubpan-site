interface IconProps {
  color?: string;
  size?: number;
}

/** Globo/rede — círculo 1 (topo) */
export function Icon1({ color = '#152852', size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M58.44 40H46.3333C44.9188 40 43.5623 40.5619 42.5621 41.5621C41.5619 42.5623 41 43.9188 41 45.3333V57.44" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.6666 8.90667V13.3333C19.6666 15.4551 20.5095 17.4899 22.0098 18.9902C23.5101 20.4905 25.5449 21.3333 27.6666 21.3333C29.0811 21.3333 30.4377 21.8952 31.4379 22.8954C32.4381 23.8956 33 25.2522 33 26.6667C33 29.6 35.4 32 38.3333 32C39.7478 32 41.1043 31.4381 42.1045 30.4379C43.1047 29.4377 43.6666 28.0812 43.6666 26.6667C43.6666 23.7333 46.0666 21.3333 49 21.3333H57.4533" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30.3333 58.5333V48C30.3333 46.5855 29.7714 45.229 28.7712 44.2288C27.771 43.2286 26.4145 42.6667 25 42.6667C23.5855 42.6667 22.229 42.1048 21.2288 41.1046C20.2286 40.1044 19.6667 38.7478 19.6667 37.3333V34.6667C19.6667 33.2522 19.1048 31.8956 18.1046 30.8954C17.1044 29.8952 15.7478 29.3333 14.3333 29.3333H6.46667" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M33 58.6667C47.7276 58.6667 59.6667 46.7276 59.6667 32C59.6667 17.2724 47.7276 5.33333 33 5.33333C18.2724 5.33333 6.33337 17.2724 6.33337 32C6.33337 46.7276 18.2724 58.6667 33 58.6667Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Formatura/capelo — círculo 2 */
export function Icon2({ color = '#152852', size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M66.045 33.6762C66.597 33.4327 67.0654 33.0326 67.3922 32.5255C67.719 32.0184 67.8899 31.4265 67.8836 30.8233C67.8774 30.22 67.6943 29.6318 67.3571 29.1316C67.0199 28.6314 66.5433 28.241 65.9864 28.009L39.5591 15.9717C38.7557 15.6052 37.883 15.4156 37 15.4156C36.117 15.4156 35.2442 15.6052 34.4408 15.9717L8.01665 27.9967C7.46772 28.2371 7.00075 28.6323 6.67283 29.1339C6.34492 29.6355 6.17029 30.2217 6.17029 30.821C6.17029 31.4203 6.34492 32.0066 6.67283 32.5082C7.00075 33.0098 7.46772 33.4049 8.01665 33.6453L34.4408 45.695C35.2442 46.0615 36.117 46.2511 37 46.2511C37.883 46.2511 38.7557 46.0615 39.5591 45.695L66.045 33.6762Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M67.8333 30.8333V49.3333" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 38.5417V49.3333C18.5 51.7866 20.4491 54.1394 23.9185 55.8741C27.3879 57.6088 32.0935 58.5833 37 58.5833C41.9065 58.5833 46.6121 57.6088 50.0815 55.8741C53.5509 54.1394 55.5 51.7866 55.5 49.3333V38.5417" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Livro aberto — círculo 3 */
export function Icon3({ color = '#152852', size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 17.5V52.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 30H45" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 20H45" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 45C6.83696 45 6.20107 44.7366 5.73223 44.2678C5.26339 43.7989 5 43.163 5 42.5V10C5 9.33696 5.26339 8.70107 5.73223 8.23223C6.20107 7.76339 6.83696 7.5 7.5 7.5H20C22.6522 7.5 25.1957 8.55357 27.0711 10.4289C28.9464 12.3043 30 14.8478 30 17.5C30 14.8478 31.0536 12.3043 32.9289 10.4289C34.8043 8.55357 37.3478 7.5 40 7.5H52.5C53.163 7.5 53.7989 7.76339 54.2678 8.23223C54.7366 8.70107 55 9.33696 55 10V42.5C55 43.163 54.7366 43.7989 54.2678 44.2678C53.7989 44.7366 53.163 45 52.5 45H37.5C35.5109 45 33.6032 45.7902 32.1967 47.1967C30.7902 48.6032 30 50.5109 30 52.5C30 50.5109 29.2098 48.6032 27.8033 47.1967C26.3968 45.7902 24.4891 45 22.5 45H7.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 30H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 20H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Documento com lupa — círculo 4 */
export function Icon4({ color = '#152852', size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M27.75 55H15C13.6739 55 12.4021 54.4732 11.4645 53.5355C10.5268 52.5978 10 51.3261 10 50V9.99999C10 8.6739 10.5268 7.40213 11.4645 6.46445C12.4021 5.52677 13.6739 4.99999 15 4.99999H35C35.7922 4.99804 36.577 5.15301 37.309 5.45595C38.041 5.75888 38.7058 6.20379 39.265 6.76499L48.2375 15.735C48.7983 16.2944 49.2427 16.9592 49.5452 17.6913C49.8477 18.4233 50.0023 19.2079 50 20V28.125" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 5V17.5C35 18.163 35.2634 18.7989 35.7322 19.2678C36.2011 19.7366 36.837 20 37.5 20H50" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52.5 55L45.3 47.8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 50C44.1421 50 47.5 46.6421 47.5 42.5C47.5 38.3579 44.1421 35 40 35C35.8579 35 32.5 38.3579 32.5 42.5C32.5 46.6421 35.8579 50 40 50Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
