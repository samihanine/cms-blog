import Image from 'next/image';

import image from 'public/images/logo.webp';

export const LogoText: React.FC<{ className: string }> = (props) => (
  <Image src={image} alt="Railtrack logo with text" {...props} />
);
