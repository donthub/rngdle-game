// Joins the class names that apply and drops the rest, so a conditional class reads as
// `condition && "class"` rather than a template string with an empty branch in it.
export default function classNames(...names) {
    return names.filter(Boolean).join(" ");
}
