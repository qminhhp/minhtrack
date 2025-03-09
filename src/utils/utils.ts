import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  // Create a URL with the encoded message as a query parameter
  const url = new URL(path, "http://localhost");
  url.searchParams.set(type, message);

  // Use only the pathname and search parts to avoid serialization issues
  return redirect(url.pathname + url.search);
}
