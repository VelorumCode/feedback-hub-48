CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    feedback text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: idx_feedback_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedback_created_at ON public.feedback USING btree (created_at DESC);


--
-- Name: idx_feedback_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedback_email ON public.feedback USING btree (email);


--
-- Name: feedback Anyone can submit feedback; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: feedback Anyone can view feedback; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view feedback" ON public.feedback FOR SELECT TO authenticated, anon USING (true);


--
-- Name: feedback; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--
