import { Form, Link } from "@remix-run/react";
import type { Media, Page } from "payload/generated-types";
import { twMerge } from "tailwind-merge";
import { useFormFields, useMailChimpForm } from "use-mailchimp-form";
import Image from "~/components/Image";

export interface Props {
  title: string;
  pagePrivacy: Page;
  mailchimpSignupUrl: string;
  images: { id: string; image: Media }[];
}

const Newsletter: React.FC<Props> = ({
  title,
  pagePrivacy,
  mailchimpSignupUrl,
  images,
}) => {
  const { loading, error, success, message, handleSubmit } =
    useMailChimpForm(mailchimpSignupUrl);
  const { fields, handleFieldChange } = useFormFields({
    ANREDE: "",
    EMAIL: "",
    FNAME: "",
    LNAME: "",
  });

  const labelClass = "sr-only";
  const inputClass = "w-full p-2 border border-gray-300 rounded-md text-xs";
  return (
    <div className="my-16">
      <div className="flex gap-16">
        <div className="w-full">
          <h2 className="">{title}</h2>
          {success ? (
            <div className="my-12 text-xl">Vielen Dank für Ihre Anmeldung!</div>
          ) : (
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(fields);
              }}
              className="flex w-full max-w-md flex-col gap-4 text-sm"
            >
              <label htmlFor="ANREDE" className={twMerge(labelClass)}>
                Anrede
              </label>
              <input
                type="text"
                name="ANREDE"
                id="ANREDE"
                value={fields.ANREDE}
                onChange={handleFieldChange}
                placeholder="Anrede"
                //   required
                className={twMerge(inputClass)}
              />
              <label htmlFor="FNAME" className={twMerge(labelClass)}>
                Vorname
              </label>
              <input
                type="text"
                name="FNAME"
                id="FNAME"
                value={fields.FNAME}
                onChange={handleFieldChange}
                placeholder="Vorname"
                //   required
                className={twMerge(inputClass)}
              />
              <label htmlFor="LNAME" className={twMerge(labelClass)}>
                Nachname
              </label>
              <input
                type="text"
                name="LNAME"
                id="LNAME"
                value={fields.LNAME}
                onChange={handleFieldChange}
                placeholder="Nachname"
                //   required
                className={twMerge(inputClass)}
              />
              <label htmlFor="EMAIL" className={twMerge(labelClass)}>
                E-Mail Adresse
              </label>
              <input
                type="email"
                name="EMAIL"
                id="EMAIL"
                value={fields.EMAIL}
                onChange={handleFieldChange}
                placeholder="E-Mail Adresse"
                //   required
                className={twMerge(inputClass)}
              />
              <label
                htmlFor="agree"
                className={twMerge(
                  labelClass,
                  "not-sr-only my-2 flex items-center text-xs",
                )}
              >
                <input
                  type="checkbox"
                  name="agree"
                  id="agree"
                  onChange={handleFieldChange}
                  required
                  className={twMerge(inputClass, "mr-2 w-fit")}
                />
                <div className="flex-nowrap">
                  Ich habe die{" "}
                  <Link
                    to={pagePrivacy.url}
                    prefetch="intent"
                    className="text-key-500"
                    target="_blank"
                  >
                    Datenschutzerklärung
                  </Link>{" "}
                  gelesen und stimme zu.
                </div>
              </label>
              {error && <div className="text-red break-words">{error}</div>}
              {message && (
                <div className="break-words font-medium">{message}</div>
              )}
              <button
                type="submit"
                className="bg-key-500 hover:bg-key-600 text-white"
              >
                {loading ? "Lade..." : "Newsletter abonnieren"}
              </button>
            </Form>
          )}
        </div>
        <div className="flex w-40 shrink-0 flex-col items-center gap-16 p-2">
          {images.map((image, index) => (
            <Image
              media={image.image}
              key={index}
              className="aspect-1/1 w-full rounded-full object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
