create table "public"."urls" (
    "id" uuid not null default gen_random_uuid(),
    "short_url" text not null,
    "long_url" text,
    "code" text,
    "created_at" timestamp without time zone not null default (now() AT TIME ZONE 'utc'::text)
);


alter table "public"."urls" enable row level security;

CREATE UNIQUE INDEX urls_pkey ON public.urls USING btree (id);

alter table "public"."urls" add constraint "urls_pkey" PRIMARY KEY using index "urls_pkey";

grant delete on table "public"."urls" to "anon";

grant insert on table "public"."urls" to "anon";

grant references on table "public"."urls" to "anon";

grant select on table "public"."urls" to "anon";

grant trigger on table "public"."urls" to "anon";

grant truncate on table "public"."urls" to "anon";

grant update on table "public"."urls" to "anon";

grant delete on table "public"."urls" to "authenticated";

grant insert on table "public"."urls" to "authenticated";

grant references on table "public"."urls" to "authenticated";

grant select on table "public"."urls" to "authenticated";

grant trigger on table "public"."urls" to "authenticated";

grant truncate on table "public"."urls" to "authenticated";

grant update on table "public"."urls" to "authenticated";

grant delete on table "public"."urls" to "service_role";

grant insert on table "public"."urls" to "service_role";

grant references on table "public"."urls" to "service_role";

grant select on table "public"."urls" to "service_role";

grant trigger on table "public"."urls" to "service_role";

grant truncate on table "public"."urls" to "service_role";

grant update on table "public"."urls" to "service_role";