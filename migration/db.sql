
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
--Name: adminpack;
Type: EXTENSION;
Schema: -;
Owner:
  --

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
--Name: votes;
Type: TYPE;
Schema: public;
Owner: postgres
  --

CREATE TYPE public.votes AS ENUM(
  '0',
  '1',
  'null'
);


ALTER TYPE public.votes OWNER TO postgres;

--
--Name: all_meets_admin(integer);
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.all_meets_admin(userid integer) RETURNS TABLE(id integer, happening numeric, topic character varying, location character varying, tags jsonb, images jsonb, rsvp jsonb)
LANGUAGE plpgsql
AS '
BEGIN
RETURN QUERY SELECT m.id, m.happening, m.topic, m.location, m.tags, m.images, rsvp_count(m.id) as rsvp
FROM public.meets m;
END;
';


ALTER FUNCTION public.all_meets_admin(userid integer) OWNER TO postgres;

--
--Name: all_meets_user(integer);
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.all_meets_user(userid integer) RETURNS TABLE(id integer, happening numeric, topic character varying, location character varying, tags jsonb, images jsonb, rsvp character varying)
LANGUAGE plpgsql
AS '
BEGIN
RETURN QUERY SELECT m.id, m.happening, m.topic, m.location, m.tags, m.images, r.rsvp
FROM public.meets m
LEFT JOIN public.rsvps r ON r.user_id = userid AND r.meetup = m.id;
END;
';


ALTER FUNCTION public.all_meets_user(userid integer) OWNER TO postgres;

--
--Name: get_notif_user(integer);
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.get_notif_user(userid integer, OUT res jsonb) RETURNS jsonb
LANGUAGE plpgsql
AS '
DECLARE
rec RECORD;
var1 bigint;
var2 text;
json1 jsonb;
jsonarr jsonb: = '' []
''::jsonb;
BEGIN
FOR rec in SELECT meet, last_seen FROM public.notifications WHERE notifications.user_id = userid
LOOP
var1: = COUNT(id) from public.questions WHERE meetup = rec.meet AND created > rec.last_seen;
var2: = var1::text;
json1: = concat('' ['', '' {
      '' || ''
      "meetup"
      '' || '': '' || rec.meet || '', '' || ''
      "last_seen"
      '' || '': '' || rec.last_seen || '', '' || ''
      "count"
      '' || '': '' || var2 || ''
    }
    '', ''
  ]
  '')::jsonb;
jsonarr: = jsonarr || json1;
END LOOP;
res = jsonarr;
END;
';


ALTER FUNCTION public.get_notif_user(userid integer, OUT res jsonb) OWNER TO postgres;

--
--Name: insert_question_votes();
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.insert_question_votes() RETURNS trigger
LANGUAGE plpgsql
AS '	 
BEGIN
UPDATE public.questions SET votes = votes + NEW.response WHERE id = NEW.question;
IF NEW.response = ''
0 ''
THEN
DELETE FROM public.vote WHERE response = ''
0 '';
END IF;
RETURN NEW;
END;
';


ALTER FUNCTION public.insert_question_votes() OWNER TO postgres;

--
--Name: json_merge(jsonb, jsonb);
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.json_merge(json1 jsonb, json2 jsonb, OUT json3 jsonb) RETURNS jsonb
LANGUAGE plpgsql
AS '
DECLARE
rec RECORD;
json4 jsonb: = json1;
json5 jsonb: = json2;
BEGIN
FOR rec in SELECT * FROM jsonb_array_elements_text(json2)
LOOP
IF json1 ? rec.value THEN
json4: = json4 - rec.value;
json5: = json5 - rec.value;
END IF;
END LOOP;
json3: = json4 || json5;
END;
';


ALTER FUNCTION public.json_merge(json1 jsonb, json2 jsonb, OUT json3 jsonb) OWNER TO postgres;

--
--Name: post_comments(integer, integer, text);
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.post_comments(user_id integer, question_id integer, comment_body text) RETURNS TABLE(question integer, body text, comment text)
LANGUAGE plpgsql
AS 'DECLARE	
sign text;
query text: = ''
INSERT INTO public.comments(user_id, question, comment) VALUES('' || user_id || '', '' || question_id || '', '' || quote_literal(comment_body) || '')
'';
BEGIN
EXECUTE query;
RETURN QUERY SELECT c.question, q.body, c.comment FROM public.comments c
LEFT JOIN public.questions q ON q.id = c.question AND c.question = 7 ORDER BY c.created DESC LIMIT 1;
END;
';


ALTER FUNCTION public.post_comments(user_id integer, question_id integer, comment_body text) OWNER TO postgres;

--
--Name: rsvp_count(integer);
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.rsvp_count(meet_id integer, OUT json1 jsonb) RETURNS jsonb
LANGUAGE plpgsql
AS '
DECLARE
rec RECORD;
json2 jsonb: = '' {
  "yes": 0,
  "maybe": 0,
  "no": 0
}
''::jsonb;
BEGIN
FOR rec in SELECT rsvp, COUNT(rsvp) FROM public.rsvps WHERE meetup = meet_id GROUP BY rsvps.rsvp
LOOP
json2: = jsonb_set(json2, ARRAY[rec.rsvp]::text[], rec.count::text::jsonb);
END LOOP;
json1: = json2;
END;
';


ALTER FUNCTION public.rsvp_count(meet_id integer, OUT json1 jsonb) OWNER TO postgres;

--
--Name: update_meet_notif();
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.update_meet_notif() RETURNS trigger
LANGUAGE plpgsql
AS '	 
BEGIN
INSERT INTO public.activity(meet, user_id, type) VALUES(
  NEW.id, ''
  1 '', ''
  1 '');
RETURN NEW;
END;
';


ALTER FUNCTION public.update_meet_notif() OWNER TO postgres;

--
--Name: update_meets(jsonb);
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.update_meets(meet_obj jsonb) RETURNS void
LANGUAGE plpgsql
AS '
DECLARE
rec RECORD;
query text;
BEGIN
query: = concat(''
  UPDATE meets SET tags = $1 WHERE id = '', ''
  '', meet_obj - >> ''
  id '');
FOR rec in SELECT * FROM jsonb_each(meet_obj) WHERE key < > ''
id ''
LOOP
RAISE NOTICE '' % '', rec.value;
EXECUTE query USING rec.value;
END LOOP;
select * from all_meets();
END;
';


ALTER FUNCTION public.update_meets(meet_obj jsonb) OWNER TO postgres;

--
--Name: update_meets_array();
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.update_meets_array() RETURNS trigger
LANGUAGE plpgsql
AS '	  
BEGIN
NEW.tags: = json_merge(OLD.tags, NEW.tags);
NEW.images: = json_merge(OLD.images, NEW.images);
RETURN NEW;
END;
';


ALTER FUNCTION public.update_meets_array() OWNER TO postgres;

--
--Name: update_question_votes();
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.update_question_votes() RETURNS trigger
LANGUAGE plpgsql
AS '	 
BEGIN
IF NEW.response = ''
0 ''
THEN
UPDATE public.questions SET votes = votes - OLD.response WHERE id = OLD.question;
DELETE FROM public.vote WHERE response = ''
0 '';
END IF;
IF OLD.response = ''
1 ''
AND NEW.response = '' - 1 ''
THEN
UPDATE public.questions SET votes = votes + NEW.response + NEW.response WHERE id = NEW.question;
END IF;
IF OLD.response = '' - 1 ''
AND NEW.response = ''
1 ''
THEN
UPDATE public.questions SET votes = votes + NEW.response + NEW.response WHERE id = NEW.question;
END IF;
RETURN NEW;
END;
';


ALTER FUNCTION public.update_question_votes() OWNER TO postgres;

--
--Name: update_rsvps(integer, integer, text);
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.update_rsvps(userid integer, meetup_id integer, rsvp text) RETURNS TABLE(meetup integer, topic character varying, status character varying)
LANGUAGE plpgsql
AS 'DECLARE	
query text: = ''
INSERT INTO public.rsvps(meetup, user_id, rsvp) VALUES('' || meetup_id || '', '' || userid || '', '' || quote_literal(rsvp) || '')
ON CONFLICT ON CONSTRAINT rsvps_unique DO NOTHING '';
BEGIN
EXECUTE query;
RETURN QUERY SELECT r.meetup, m.topic, r.rsvp FROM public.rsvps r LEFT JOIN public.meets m ON r.meetup = m.id WHERE r.meetup = meetup_id AND r.user_id = userid;
END;
';


ALTER FUNCTION public.update_rsvps(userid integer, meetup_id integer, rsvp text) OWNER TO postgres;

--
--Name: update_votes(integer, integer, integer);
Type: FUNCTION;
Schema: public;
Owner: postgres
  --

CREATE FUNCTION public.update_votes(user_id integer, question integer, vote integer) RETURNS TABLE(meetup integer, body text, votes integer)
LANGUAGE plpgsql
AS 'DECLARE	
sign text;
query text: = ''
INSERT INTO public.vote(user_id, question, response) VALUES('' || user_id || '', '' || question || '', '' || vote || '')
ON CONFLICT ON CONSTRAINT votes_unique DO UPDATE SET response = '' || vote;
BEGIN
EXECUTE query;
RETURN QUERY SELECT q.meetup, q.body, q.votes FROM public.questions q WHERE id = question;
END;
';


ALTER FUNCTION public.update_votes(user_id integer, question integer, vote integer) OWNER TO postgres;

--
--Name: activity_id_seq;
Type: SEQUENCE;
Schema: public;
Owner: postgres
  --

CREATE SEQUENCE public.activity_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.activity_id_seq OWNER TO postgres;

--
--Name: comments_id_seq;
Type: SEQUENCE;
Schema: public;
Owner: postgres
  --

CREATE SEQUENCE public.comments_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
--Name: comments;
Type: TABLE;
Schema: public;
Owner: postgres
  --

CREATE TABLE public.comments(
  id integer DEFAULT nextval('public.comments_id_seq'::regclass) NOT NULL,
  user_id integer NOT NULL,
  question integer NOT NULL,
  comment text NOT NULL,
  created numeric DEFAULT floor((date_part('epoch'::text, timezone('UTC'::text, now())) * (1000)::double precision)) NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
--Name: meet_id_seq;
Type: SEQUENCE;
Schema: public;
Owner: postgres
  --

CREATE SEQUENCE public.meet_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.meet_id_seq OWNER TO postgres;

--
--Name: meets;
Type: TABLE;
Schema: public;
Owner: postgres
  --

CREATE TABLE public.meets(
  id integer DEFAULT nextval('public.meet_id_seq'::regclass) NOT NULL,
  topic character varying(200) NOT NULL,
  location character varying(45) NOT NULL,
  tags jsonb DEFAULT '[]'::jsonb NOT NULL,
  images jsonb DEFAULT '[]'::jsonb NOT NULL,
  created numeric DEFAULT floor((date_part('epoch'::text, timezone('UTC'::text, now())) * (1000)::double precision)) NOT NULL,
  happening numeric DEFAULT floor((date_part('epoch'::text, timezone('UTC'::text, now())) * (1000)::double precision)) NOT NULL,
  test integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.meets OWNER TO postgres;

--
--Name: notif_types_id_seq;
Type: SEQUENCE;
Schema: public;
Owner: postgres
  --

CREATE SEQUENCE public.notif_types_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.notif_types_id_seq OWNER TO postgres;

--
--Name: notifications_id_seq;
Type: SEQUENCE;
Schema: public;
Owner: postgres
  --

CREATE SEQUENCE public.notifications_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO postgres;

--
--Name: notifications;
Type: TABLE;
Schema: public;
Owner: postgres
  --

CREATE TABLE public.notifications(
  id integer DEFAULT nextval('public.notifications_id_seq'::regclass) NOT NULL,
  user_id integer NOT NULL,
  meet integer NOT NULL,
  last_seen numeric DEFAULT floor((date_part('epoch'::text, timezone('UTC'::text, now())) * (1000)::double precision)) NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
--Name: question_id_seq;
Type: SEQUENCE;
Schema: public;
Owner: postgres
  --

CREATE SEQUENCE public.question_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.question_id_seq OWNER TO postgres;

--
--Name: questions;
Type: TABLE;
Schema: public;
Owner: postgres
  --

CREATE TABLE public.questions(
  user_id integer NOT NULL,
  meetup integer NOT NULL,
  body text NOT NULL,
  votes integer DEFAULT 0,
  created numeric DEFAULT floor((date_part('epoch'::text, timezone('UTC'::text, now())) * (1000)::double precision)) NOT NULL,
  id integer DEFAULT nextval('public.question_id_seq'::regclass) NOT NULL
);


ALTER TABLE public.questions OWNER TO postgres;

--
--Name: rsvps;
Type: TABLE;
Schema: public;
Owner: postgres
  --

CREATE TABLE public.rsvps(
  meetup integer NOT NULL,
  user_id integer NOT NULL,
  rsvp character varying(5) DEFAULT NULL::character varying
);


ALTER TABLE public.rsvps OWNER TO postgres;

--
--Name: user_id_seq;
Type: SEQUENCE;
Schema: public;
Owner: postgres
  --

CREATE SEQUENCE public.user_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
--Name: user;
Type: TABLE;
Schema: public;
Owner: postgres
  --

CREATE TABLE public.
"user"(
  id integer DEFAULT nextval('public.user_id_seq'::regclass) NOT NULL,
  firstname character varying(45) NOT NULL,
  lastname character varying(45) NOT NULL,
  othername character varying(45) DEFAULT NULL::character varying,
  username character varying(45) DEFAULT NULL::character varying,
  email character varying(50) NOT NULL,
  phonenumber text NOT NULL,
  isadmin boolean DEFAULT false NOT NULL,
  password text DEFAULT 'secret'::text NOT NULL,
  registered numeric DEFAULT floor((date_part('epoch'::text, timezone('UTC'::text, now())) * (1000)::double precision)) NOT NULL
);


ALTER TABLE public.
"user"
OWNER TO postgres;

--
--Name: vote;
Type: TABLE;
Schema: public;
Owner: postgres
  --

CREATE TABLE public.vote(
  user_id integer NOT NULL,
  question integer NOT NULL,
  response smallint DEFAULT '0'::smallint NOT NULL
);


ALTER TABLE public.vote OWNER TO postgres;

--
--Name: comments comments_pkey;
Type: CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.comments
ADD CONSTRAINT comments_pkey PRIMARY KEY(id);


--
--Name: meets meet_pkey;
Type: CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.meets
ADD CONSTRAINT meet_pkey PRIMARY KEY(id);


--
--Name: notifications notifications_pkey;
Type: CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.notifications
ADD CONSTRAINT notifications_pkey PRIMARY KEY(id);


--
--Name: notifications notifications_unique;
Type: CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.notifications
ADD CONSTRAINT notifications_unique UNIQUE(user_id, meet);


--
--Name: questions question_pkey;
Type: CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.questions
ADD CONSTRAINT question_pkey PRIMARY KEY(id);


--
--Name: rsvps rsvps_unique;
Type: CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.rsvps
ADD CONSTRAINT rsvps_unique UNIQUE(meetup, user_id);


--
--Name: user user_email_key;
Type: CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.
"user"
ADD CONSTRAINT user_email_key UNIQUE(email);


--
--Name: user user_pkey;
Type: CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.
"user"
ADD CONSTRAINT user_pkey PRIMARY KEY(id);


--
--Name: vote votes_unique;
Type: CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.vote
ADD CONSTRAINT votes_unique UNIQUE(user_id, question);


--
--Name: comment_created_index;
Type: INDEX;
Schema: public;
Owner: postgres
  --

CREATE INDEX comment_created_index ON public.comments USING btree(created DESC NULLS LAST);


--
--Name: fki_comments_question_id_fkey;
Type: INDEX;
Schema: public;
Owner: postgres
  --

CREATE INDEX fki_comments_question_id_fkey ON public.comments USING btree(question);


--
--Name: fki_comments_user_id_fkey;
Type: INDEX;
Schema: public;
Owner: postgres
  --

CREATE INDEX fki_comments_user_id_fkey ON public.comments USING btree(user_id);


--
--Name: fki_notifications_meet_fkey;
Type: INDEX;
Schema: public;
Owner: postgres
  --

CREATE INDEX fki_notifications_meet_fkey ON public.notifications USING btree(meet);


--
--Name: fki_notifications_user_id_fkey;
Type: INDEX;
Schema: public;
Owner: postgres
  --

CREATE INDEX fki_notifications_user_id_fkey ON public.notifications USING btree(user_id);


--
--Name: fki_rsvps_meetup_fkey;
Type: INDEX;
Schema: public;
Owner: postgres
  --

CREATE INDEX fki_rsvps_meetup_fkey ON public.rsvps USING btree(meetup);


--
--Name: fki_rsvps_user_id_fkey;
Type: INDEX;
Schema: public;
Owner: postgres
  --

CREATE INDEX fki_rsvps_user_id_fkey ON public.rsvps USING btree(user_id);


--
--Name: fki_votes_question_fkey;
Type: INDEX;
Schema: public;
Owner: postgres
  --

CREATE INDEX fki_votes_question_fkey ON public.vote USING btree(question);


--
--Name: fki_votes_user_id_fkey;
Type: INDEX;
Schema: public;
Owner: postgres
  --

CREATE INDEX fki_votes_user_id_fkey ON public.vote USING btree(user_id);


--
--Name: user_email_index;
Type: INDEX;
Schema: public;
Owner: postgres
  --

CREATE INDEX user_email_index ON public.
"user"
USING btree(email) INCLUDE(email);


--
--Name: vote insert_vote;
Type: TRIGGER;
Schema: public;
Owner: postgres
  --

CREATE TRIGGER insert_vote AFTER INSERT ON public.vote FOR EACH ROW EXECUTE PROCEDURE public.insert_question_votes();


--
--Name: meets update_arrays;
Type: TRIGGER;
Schema: public;
Owner: postgres
  --

CREATE TRIGGER update_arrays BEFORE UPDATE ON public.meets FOR EACH ROW EXECUTE PROCEDURE public.update_meets_array();


--
--Name: vote update_vote;
Type: TRIGGER;
Schema: public;
Owner: postgres
  --

CREATE TRIGGER update_vote AFTER UPDATE OF response ON public.vote FOR EACH ROW EXECUTE PROCEDURE public.update_question_votes();


--
--Name: comments comments_questions_fkey;
Type: FK CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.comments
ADD CONSTRAINT comments_questions_fkey FOREIGN KEY(question) REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
--Name: comments comments_user_id_fkey;
Type: FK CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.comments
ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY(user_id) REFERENCES public.
"user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
--Name: notifications notifications_meet_fkey;
Type: FK CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.notifications
ADD CONSTRAINT notifications_meet_fkey FOREIGN KEY(meet) REFERENCES public.meets(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
--Name: notifications notifications_user_id_fkey;
Type: FK CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.notifications
ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY(user_id) REFERENCES public.
"user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
--Name: questions question_created_by_fkey;
Type: FK CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.questions
ADD CONSTRAINT question_created_by_fkey FOREIGN KEY(user_id) REFERENCES public.
"user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
--Name: questions question_meetup_fkey;
Type: FK CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.questions
ADD CONSTRAINT question_meetup_fkey FOREIGN KEY(meetup) REFERENCES public.meets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
--Name: rsvps rsvps_meetup_fkey;
Type: FK CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.rsvps
ADD CONSTRAINT rsvps_meetup_fkey FOREIGN KEY(meetup) REFERENCES public.meets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
--Name: rsvps rsvps_user_id_fkey;
Type: FK CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.rsvps
ADD CONSTRAINT rsvps_user_id_fkey FOREIGN KEY(user_id) REFERENCES public.
"user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
--Name: vote vote_question_fkey;
Type: FK CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.vote
ADD CONSTRAINT vote_question_fkey FOREIGN KEY(question) REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
--Name: vote votes_user_id_fkey;
Type: FK CONSTRAINT;
Schema: public;
Owner: postgres
  --

ALTER TABLE ONLY public.vote
ADD CONSTRAINT votes_user_id_fkey FOREIGN KEY(user_id) REFERENCES public.
"user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
--PostgreSQL database dump complete
--