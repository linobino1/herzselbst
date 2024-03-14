import { twMerge } from "tailwind-merge";

export interface Props extends React.HTMLAttributes<HTMLElement> {
  content: string;
  as?: React.ElementType<React.HTMLAttributes<HTMLElement>>;
}

export const RichText: React.FC<Props> = ({
  content,
  as: Component = "div",
  className,
  ...props
}) => {
  return (
    <Component
      dangerouslySetInnerHTML={{
        __html: content,
      }}
      className={twMerge("lexical", className)}
      {...props}
    />
  );
};

export default RichText;
