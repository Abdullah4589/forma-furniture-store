import type { ComponentProps } from 'react';

type FullPageLinkProps = Omit<ComponentProps<'a'>, 'href'> & { href: string };

// Document navigation avoids the current Vinext production router's RSC prefetch error.
export default function FullPageLink({ href, ...props }: FullPageLinkProps) {
    return <a href={href} {...props}/>;
}
